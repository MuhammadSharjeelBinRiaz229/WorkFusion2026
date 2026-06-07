import { ReviewRepository } from "../repositories/review.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { JobRepository } from "../repositories/job.repository.js";
import { ApplicationRepository } from "../repositories/application.repository.js";
import { ActivityLog } from "../models/ActivityLog.js";
import mongoose from "mongoose";

export class ReviewController {
  reviewRepo = new ReviewRepository();
  userRepo = new UserRepository();
  jobRepo = new JobRepository();
  appRepo = new ApplicationRepository();

  createReview = async (req, res, next) => {
    try {
      const reviewerId = req.user?.id;
      const role = req.user?.role;
      if (!reviewerId || !role) throw new Error("Unauthorized");

      const { jobId, receiverId, rating, comment } = req.body;

      const job = await this.jobRepo.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: "Job listing not found" });
      }

      const seekerId = role === "Service Seeker" ? reviewerId : receiverId;
      const app = await this.appRepo.findByJobAndSeeker(jobId, seekerId);
      
      if (!app || app.status !== "Completed") {
        return res.status(400).json({
          success: false,
          message: "Reviews can only be submitted after the contract has been marked Completed.",
        });
      }

      const review = await this.reviewRepo.create({
        jobId: new mongoose.Types.ObjectId(jobId),
        reviewer: new mongoose.Types.ObjectId(reviewerId),
        receiver: new mongoose.Types.ObjectId(receiverId),
        rating,
        comment,
      });

      const stats = await this.reviewRepo.getAverageRatingForUser(receiverId);
      await this.userRepo.update(receiverId, {
        rating: stats.avgRating,
        reviewCount: stats.count,
      });

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(reviewerId),
        action: "Create Review",
        entity: "Review",
        entityId: review._id,
      });

      return res.status(211).json({
        success: true,
        message: "Review submitted successfully",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  };

  getReviews = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const result = await this.reviewRepo.getReviewsForUser(userId, {
        page: Number(page),
        limit: Number(limit),
      });
      return res.status(200).json({
        success: true,
        message: "Reviews retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
