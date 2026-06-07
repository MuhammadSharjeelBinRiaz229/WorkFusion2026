import { ApplicationRepository } from "../repositories/application.repository.js";
import { JobRepository } from "../repositories/job.repository.js";
import { ChatRepository } from "../repositories/chat.repository.js";
import { ApplicationStatus, NotificationType } from "shared";
import { Notification } from "../models/Notification.js";
import { logger } from "../utils/logger.js";
import mongoose from "mongoose";

export class ApplicationService {
  appRepo = new ApplicationRepository();
  jobRepo = new JobRepository();
  chatRepo = new ChatRepository();

  async apply(seekerId, input) {
    const job = await this.jobRepo.findById(input.jobId);
    if (!job) {
      const error = new Error("Job listing not found");
      error.status = 404;
      throw error;
    }

    const existing = await this.appRepo.findByJobAndSeeker(input.jobId, seekerId);
    if (existing) {
      const error = new Error("You have already applied to this job listing");
      error.status = 400;
      throw error;
    }

    const appData = {
      ...input,
      seekerId,
      status: ApplicationStatus.APPLIED,
    };
    const app = await this.appRepo.create(appData);
    logger.info(`Application submitted: Seeker ${seekerId} applied to Job ${input.jobId}`);

    const employerId = job.employerId;
    const empRawId = employerId._id ? employerId._id : employerId;

    await Notification.create({
      userId: empRawId,
      title: "New Job Applicant",
      body: `A candidate has applied for your posting: "${job.title}".`,
      type: NotificationType.APPLICATION,
    });

    return app;
  }

  async updateStatus(applicationId, userId, role, newStatus) {
    const app = await this.appRepo.findById(applicationId);
    if (!app) {
      const error = new Error("Application not found");
      error.status = 404;
      throw error;
    }

    const jobIdStr = app.jobId._id ? app.jobId._id.toString() : app.jobId.toString();
    const job = await this.jobRepo.findById(jobIdStr);
    if (!job) {
      const error = new Error("Associated job not found");
      error.status = 404;
      throw error;
    }

    const jobOwnerId = job.employerId._id ? job.employerId._id.toString() : job.employerId.toString();
    
    if (jobOwnerId !== userId && role !== "Admin") {
      const error = new Error("Unauthorized: Only the employer who posted the job can update candidate application states.");
      error.status = 403;
      throw error;
    }

    const oldStatus = app.status;
    app.status = newStatus;
    const updatedApp = await this.appRepo.update(applicationId, { status: newStatus });
    if (!updatedApp) {
      throw new Error("Failed to update application status");
    }

    logger.info(`Application ${applicationId} status transitioned from ${oldStatus} to ${newStatus}`);

    if (newStatus === ApplicationStatus.INTERVIEW) {
      const seekerIdStr = app.seekerId._id ? app.seekerId._id.toString() : app.seekerId.toString();
      const existingChat = await this.chatRepo.findChatBetweenUsers(
        job._id.toString(),
        seekerIdStr
      );

      if (!existingChat) {
        await this.chatRepo.createChat({
          jobId: job._id,
          employerId: new mongoose.Types.ObjectId(jobOwnerId),
          seekerId: new mongoose.Types.ObjectId(seekerIdStr),
          status: "Active",
        });
        logger.info(`Secure Chat channel established for Seeker ${seekerIdStr} and Job ${job._id}`);
      }
    }

    let notifTitle = "Application Updated";
    let notifBody = `Your application for "${job.title}" has been updated to: ${newStatus}.`;

    if (newStatus === ApplicationStatus.INTERVIEW) {
      notifTitle = "Interview Scheduled & Chat Enabled";
      notifBody = `The employer for "${job.title}" has scheduled an interview. Direct messaging is now enabled!`;
    } else if (newStatus === ApplicationStatus.ACCEPTED) {
      notifTitle = "Application Accepted";
      notifBody = `Congratulations! Your application for "${job.title}" has been accepted.`;
    } else if (newStatus === ApplicationStatus.REJECTED) {
      notifTitle = "Application Rejected";
      notifBody = `We regret to inform you that your application for "${job.title}" was not selected.`;
    }

    await Notification.create({
      userId: app.seekerId,
      title: notifTitle,
      body: notifBody,
      type: newStatus === ApplicationStatus.INTERVIEW ? NotificationType.INTERVIEW : NotificationType.SYSTEM,
    });

    return updatedApp;
  }

  async getApplications(filters) {
    const query = {};
    if (filters.seekerId) query.seekerId = filters.seekerId;
    if (filters.jobId) query.jobId = filters.jobId;
    if (filters.status) query.status = filters.status;

    return await this.appRepo.findAll(query, {
      page: filters.page,
      limit: filters.limit,
      sort: { createdAt: -1 },
    });
  }
}
