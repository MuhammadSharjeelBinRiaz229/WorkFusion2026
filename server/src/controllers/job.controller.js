import { JobService } from "../services/job.service.js";
import { RecommendationService } from "../services/recommendation.service.js";
import { ActivityLog } from "../models/ActivityLog.js";
import mongoose from "mongoose";

export class JobController {
  jobService = new JobService();
  recommendationService = new RecommendationService();

  createJob = async (req, res, next) => {
    try {
      const employerId = req.user?.id;
      if (!employerId) throw new Error("Unauthorized");
      const job = await this.jobService.createJob(employerId, req.body);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(employerId),
        action: "Create Job",
        entity: "Job",
        entityId: job._id,
      });

      return res.status(211).json({
        success: true,
        message: "Job listing created successfully",
        data: job,
      });
    } catch (error) {
      next(error);
    }
  };

  getJobById = async (req, res, next) => {
    try {
      const job = await this.jobService.getJobById(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Job details retrieved successfully",
        data: job,
      });
    } catch (error) {
      next(error);
    }
  };

  updateJob = async (req, res, next) => {
    try {
      const employerId = req.user?.id;
      if (!employerId) throw new Error("Unauthorized");
      const job = await this.jobService.updateJob(req.params.id, employerId, req.body);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(employerId),
        action: "Update Job",
        entity: "Job",
        entityId: job._id,
      });

      return res.status(200).json({
        success: true,
        message: "Job listing updated successfully",
        data: job,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteJob = async (req, res, next) => {
    try {
      const employerId = req.user?.id;
      if (!employerId) throw new Error("Unauthorized");
      await this.jobService.deleteJob(req.params.id, employerId);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(employerId),
        action: "Delete Job",
        entity: "Job",
        entityId: new mongoose.Types.ObjectId(req.params.id),
      });

      return res.status(200).json({
        success: true,
        message: "Job listing deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getJobs = async (req, res, next) => {
    try {
      const {
        search,
        category,
        serviceType,
        workType,
        location,
        minBudget,
        maxBudget,
        employerId,
        status,
        page = 1,
        limit = 10,
        sort,
      } = req.query;

      const jobsData = await this.jobService.getJobs({
        search: search ? String(search) : undefined,
        category: category ? String(category) : undefined,
        serviceType: serviceType ? String(serviceType) : undefined,
        workType: workType ? String(workType) : undefined,
        location: location ? String(location) : undefined,
        minBudget: minBudget ? Number(minBudget) : undefined,
        maxBudget: maxBudget ? Number(maxBudget) : undefined,
        employerId: employerId ? String(employerId) : undefined,
        status: status ? status : undefined,
        page: Number(page),
        limit: Number(limit),
        sort: sort ? String(sort) : undefined,
      });

      return res.status(200).json({
        success: true,
        message: "Jobs retrieved successfully",
        data: jobsData,
      });
    } catch (error) {
      next(error);
    }
  };

  getRecommendedJobs = async (req, res, next) => {
    try {
      const seekerId = req.user?.id;
      if (!seekerId) throw new Error("Unauthorized");
      const limit = req.query.limit ? Number(req.query.limit) : 50;

      const recommendations = await this.recommendationService.getJobRecommendations(seekerId, limit);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(seekerId),
        action: "View Job Recommendations",
        entity: "Recommendation",
      });

      return res.status(200).json({
        success: true,
        message: "AI job recommendations retrieved successfully",
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  };

  getRecommendedCandidates = async (req, res, next) => {
    try {
      const employerId = req.user?.id;
      if (!employerId) throw new Error("Unauthorized");
      const jobId = req.params.jobId;
      const limit = req.query.limit ? Number(req.query.limit) : 30;

      const recommendations = await this.recommendationService.getCandidateRecommendations(jobId, limit);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(employerId),
        action: "View Candidate Recommendations",
        entity: "Recommendation",
        entityId: new mongoose.Types.ObjectId(jobId),
      });

      return res.status(200).json({
        success: true,
        message: "AI candidate recommendations retrieved successfully",
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  };
}
