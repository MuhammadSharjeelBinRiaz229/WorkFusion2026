import { JobRepository } from "../repositories/job.repository.js";
import { JobStatus } from "shared";
import { logger } from "../utils/logger.js";

export class JobService {
  jobRepo = new JobRepository();

  async createJob(employerId, input) {
    const jobData = {
      ...input,
      employerId,
      status: JobStatus.OPEN,
    };
    const job = await this.jobRepo.create(jobData);
    logger.info(`Job created: ${job.title} by Employer ID ${employerId}`);
    return job;
  }

  async getJobById(id) {
    const job = await this.jobRepo.findById(id);
    if (!job) {
      throw new Error("Job not found");
    }
    return job;
  }

  async updateJob(jobId, employerId, input) {
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const ownerId = job.employerId._id ? job.employerId._id.toString() : job.employerId.toString();
    if (ownerId !== employerId) {
      throw new Error("Unauthorized: You do not own this job listing");
    }

    const updated = await this.jobRepo.update(jobId, input);
    if (!updated) {
      throw new Error("Failed to update job");
    }
    logger.info(`Job updated: ${updated.title} (${jobId})`);
    return updated;
  }

  async deleteJob(jobId, employerId) {
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const ownerId = job.employerId._id ? job.employerId._id.toString() : job.employerId.toString();
    if (ownerId !== employerId) {
      throw new Error("Unauthorized: You do not own this job listing");
    }

    await this.jobRepo.delete(jobId);
    logger.info(`Job deleted: ${job.title} (${jobId})`);
  }

  async getJobs(filters) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    } else {
      query.status = JobStatus.OPEN;
    }

    if (filters.employerId) {
      query.employerId = filters.employerId;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.serviceType) {
      query.serviceType = filters.serviceType;
    }

    if (filters.workType) {
      query.workType = filters.workType;
    }

    if (filters.location) {
      query.location = { $regex: filters.location, $options: "i" };
    }

    if (filters.minBudget !== undefined || filters.maxBudget !== undefined) {
      query.budget = {};
      if (filters.minBudget !== undefined) query.budget.$gte = filters.minBudget;
      if (filters.maxBudget !== undefined) query.budget.$lte = filters.maxBudget;
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
        { requiredSkills: { $in: [new RegExp(filters.search, "i")] } },
      ];
    }

    let sortObj = { createdAt: -1 };
    if (filters.sort) {
      if (filters.sort === "budget_high") {
        sortObj = { budget: -1 };
      } else if (filters.sort === "budget_low") {
        sortObj = { budget: 1 };
      } else if (filters.sort === "oldest") {
        sortObj = { createdAt: 1 };
      }
    }

    return await this.jobRepo.findAll(query, {
      page: filters.page,
      limit: filters.limit,
      sort: sortObj,
    });
  }
}
