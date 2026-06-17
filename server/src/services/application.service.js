import { ApplicationRepository } from "../repositories/application.repository.js";
import { JobRepository } from "../repositories/job.repository.js";
import { ChatRepository } from "../repositories/chat.repository.js";
import { ApplicationStatus, NotificationType } from "shared";
import { Notification } from "../models/Notification.js";
import { Application } from "../models/Application.js";
import { logger } from "../utils/logger.js";
import mongoose from "mongoose";

// Valid employer-driven transitions
const EMPLOYER_TRANSITIONS = {
  [ApplicationStatus.APPLIED]:   [ApplicationStatus.REVIEWED, ApplicationStatus.INTERVIEW, ApplicationStatus.REJECTED],
  [ApplicationStatus.PENDING]:   [ApplicationStatus.REVIEWED, ApplicationStatus.INTERVIEW, ApplicationStatus.REJECTED],
  [ApplicationStatus.REVIEWED]:  [ApplicationStatus.INTERVIEW, ApplicationStatus.REJECTED],
  [ApplicationStatus.INTERVIEW]: [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED],
  [ApplicationStatus.ACCEPTED]:  [ApplicationStatus.HIRED, ApplicationStatus.REJECTED],
  [ApplicationStatus.HIRED]:     [ApplicationStatus.COMPLETED],
  [ApplicationStatus.COMPLETED]: [],
  [ApplicationStatus.REJECTED]:  [],
};

// Statuses seeker can withdraw from (before the interview stage)
const WITHDRAWABLE_STATUSES = new Set([
  ApplicationStatus.APPLIED,
  ApplicationStatus.PENDING,
  ApplicationStatus.REVIEWED,
]);

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
      statusHistory: [{ status: ApplicationStatus.APPLIED, changedBy: new mongoose.Types.ObjectId(seekerId), note: "Application submitted" }],
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

  async updateStatus(applicationId, userId, role, newStatus, meta = {}) {
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

    // Validate transition via state machine
    const allowedNext = EMPLOYER_TRANSITIONS[oldStatus] || [];
    if (!allowedNext.includes(newStatus)) {
      const error = new Error(
        `Invalid transition: cannot move from "${oldStatus}" to "${newStatus}". Allowed next statuses: ${allowedNext.join(", ") || "none"}.`
      );
      error.status = 422;
      throw error;
    }

    const historyEntry = {
      status: newStatus,
      changedBy: new mongoose.Types.ObjectId(userId),
      note: meta.note || "",
      changedAt: new Date(),
    };

    const updateData = {
      status: newStatus,
      $push: { statusHistory: historyEntry },
    };

    if (newStatus === ApplicationStatus.INTERVIEW) {
      if (meta.interviewDate) updateData.interviewDate = new Date(meta.interviewDate);
      if (meta.interviewNote !== undefined) updateData.interviewNote = meta.interviewNote;
    }
    if (newStatus === ApplicationStatus.ACCEPTED && meta.offerNote !== undefined) {
      updateData.offerNote = meta.offerNote;
    }

    const updatedApp = await Application.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true }
    ).populate("jobId").populate("seekerId", "fullName email");

    if (!updatedApp) throw new Error("Failed to update application status");

    logger.info(`Application ${applicationId} status transitioned from ${oldStatus} to ${newStatus}`);

    // Auto-create chat channel on Interview
    if (newStatus === ApplicationStatus.INTERVIEW) {
      const seekerIdStr = app.seekerId._id ? app.seekerId._id.toString() : app.seekerId.toString();
      const existingChat = await this.chatRepo.findChatBetweenUsers(job._id.toString(), seekerIdStr);
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

    // Notifications
    const notifMap = {
      [ApplicationStatus.REVIEWED]:  { title: "Application Under Review",       body: `Your application for "${job.title}" is being reviewed by the employer.`,      type: NotificationType.APPLICATION },
      [ApplicationStatus.INTERVIEW]: { title: "Interview Scheduled",             body: `Great news! You've been invited to interview for "${job.title}". Chat is now unlocked.`, type: NotificationType.INTERVIEW },
      [ApplicationStatus.ACCEPTED]:  { title: "Offer Extended 🎉",              body: `The employer has extended a job offer for "${job.title}". Please respond in your Applications tab.`, type: NotificationType.ACCEPTED },
      [ApplicationStatus.HIRED]:     { title: "Contract Started",                body: `Your contract for "${job.title}" is now active. Deliver great work!`,         type: NotificationType.SYSTEM },
      [ApplicationStatus.COMPLETED]: { title: "Contract Completed",              body: `The contract for "${job.title}" has been marked complete. Please leave a review!`, type: NotificationType.SYSTEM },
      [ApplicationStatus.REJECTED]:  { title: "Application Not Selected",        body: `We regret to inform you that your application for "${job.title}" was not selected this time.`, type: NotificationType.SYSTEM },
    };

    const notif = notifMap[newStatus];
    if (notif) {
      await Notification.create({ userId: app.seekerId, ...notif });
    }

    return updatedApp;
  }

  async withdrawApplication(applicationId, seekerId) {
    const app = await this.appRepo.findById(applicationId);
    if (!app) {
      const error = new Error("Application not found");
      error.status = 404;
      throw error;
    }

    const appSeekerStr = app.seekerId._id ? app.seekerId._id.toString() : app.seekerId.toString();
    if (appSeekerStr !== seekerId) {
      const error = new Error("Unauthorized: This is not your application");
      error.status = 403;
      throw error;
    }

    if (!WITHDRAWABLE_STATUSES.has(app.status)) {
      const error = new Error(`Cannot withdraw an application with status "${app.status}". Withdrawal is only allowed when status is Applied or Reviewed.`);
      error.status = 422;
      throw error;
    }

    const jobIdStr = app.jobId._id ? app.jobId._id.toString() : app.jobId.toString();
    const job = await this.jobRepo.findById(jobIdStr);

    const historyEntry = {
      status: ApplicationStatus.REJECTED,
      changedBy: new mongoose.Types.ObjectId(seekerId),
      note: "Withdrawn by applicant",
      changedAt: new Date(),
    };

    const updatedApp = await Application.findByIdAndUpdate(
      applicationId,
      { status: ApplicationStatus.REJECTED, $push: { statusHistory: historyEntry } },
      { new: true }
    );

    logger.info(`Application ${applicationId} withdrawn by seeker ${seekerId}`);

    if (job) {
      const jobOwnerId = job.employerId._id ? job.employerId._id.toString() : job.employerId.toString();
      await Notification.create({
        userId: jobOwnerId,
        title: "Applicant Withdrew",
        body: `A candidate has withdrawn their application for "${job.title}".`,
        type: NotificationType.APPLICATION,
      });
    }

    return updatedApp;
  }

  async respondToOffer(applicationId, seekerId, accept) {
    const app = await this.appRepo.findById(applicationId);
    if (!app) {
      const error = new Error("Application not found");
      error.status = 404;
      throw error;
    }

    const appSeekerStr = app.seekerId._id ? app.seekerId._id.toString() : app.seekerId.toString();
    if (appSeekerStr !== seekerId) {
      const error = new Error("Unauthorized: This is not your application");
      error.status = 403;
      throw error;
    }

    if (app.status !== ApplicationStatus.ACCEPTED) {
      const error = new Error("You can only respond to an offer when the status is 'Accepted'.");
      error.status = 422;
      throw error;
    }

    const newStatus = accept ? ApplicationStatus.HIRED : ApplicationStatus.REJECTED;
    const noteText = accept ? "Offer accepted by applicant" : "Offer declined by applicant";

    const historyEntry = {
      status: newStatus,
      changedBy: new mongoose.Types.ObjectId(seekerId),
      note: noteText,
      changedAt: new Date(),
    };

    const updatedApp = await Application.findByIdAndUpdate(
      applicationId,
      { status: newStatus, $push: { statusHistory: historyEntry } },
      { new: true }
    );

    const jobIdStr = app.jobId._id ? app.jobId._id.toString() : app.jobId.toString();
    const job = await this.jobRepo.findById(jobIdStr);
    const jobOwnerId = job?.employerId?._id?.toString() || job?.employerId?.toString();

    logger.info(`Application ${applicationId} offer ${accept ? "accepted" : "declined"} by seeker ${seekerId}`);

    if (job && jobOwnerId) {
      await Notification.create({
        userId: jobOwnerId,
        title: accept ? "Offer Accepted 🎉" : "Offer Declined",
        body: accept
          ? `The candidate has accepted your offer for "${job.title}". The contract is now active!`
          : `The candidate has declined your offer for "${job.title}".`,
        type: accept ? NotificationType.ACCEPTED : NotificationType.SYSTEM,
      });
    }

    return updatedApp;
  }

  async getApplications(filters) {
    const query = {};
    if (filters.seekerId) query.seekerId = filters.seekerId;
    if (filters.jobId) query.jobId = filters.jobId;
    if (filters.status) query.status = filters.status;

    const result = await this.appRepo.findAll(query, {
      page: filters.page,
      limit: filters.limit,
      sort: { createdAt: -1 },
    });

    const applicationsWithCount = await Promise.all(
      result.applications.map(async (app) => {
        const appObj = app.toObject();
        if (app.seekerId && app.jobId) {
          const seekerId = app.seekerId._id || app.seekerId;
          const currentCategory = app.jobId.category;

          const completedApplications = await Application.find({
            seekerId,
            status: "Completed",
          }).populate("jobId");

          const matchingCompletedCount = completedApplications.filter((completedApp) => {
            return (
              completedApp.jobId &&
              completedApp.jobId.category === currentCategory &&
              completedApp._id.toString() !== app._id.toString()
            );
          }).length;

          appObj.completedSimilarJobsCount = matchingCompletedCount;
        } else {
          appObj.completedSimilarJobsCount = 0;
        }
        return appObj;
      })
    );

    return {
      applications: applicationsWithCount,
      total: result.total,
    };
  }
}
