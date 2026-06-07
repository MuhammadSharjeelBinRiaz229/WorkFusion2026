import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { Category } from "../models/Category.js";
import { UserRole } from "shared";
import mongoose from "mongoose";

export class AdminController {
  moderateUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { status, isVerified } = req.body;

      const updateData = {};
      if (status) updateData.status = status;
      if (isVerified !== undefined) updateData.isVerified = isVerified;

      const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(req.user?.id),
        action: `Moderate User: status=${status}, verified=${isVerified}`,
        entity: "User",
        entityId: user._id,
      });

      return res.status(200).json({
        success: true,
        message: "User status updated by Administrator",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  moderateJob = async (req, res, next) => {
    try {
      const { jobId } = req.params;
      const { status } = req.body;

      const job = await Job.findByIdAndUpdate(jobId, { $set: { status } }, { new: true });
      if (!job) {
        return res.status(404).json({ success: false, message: "Job listing not found" });
      }

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(req.user?.id),
        action: `Moderate Job: status=${status}`,
        entity: "Job",
        entityId: job._id,
      });

      return res.status(200).json({
        success: true,
        message: "Job listing updated by Administrator",
        data: job,
      });
    } catch (error) {
      next(error);
    }
  };

  getAnalytics = async (req, res, next) => {
    try {
      const totalEmployers = await User.countDocuments({ role: UserRole.EMPLOYER });
      const totalSeekers = await User.countDocuments({ role: UserRole.SEEKER });
      const totalJobs = await Job.countDocuments();
      const totalApplications = await Application.countDocuments();

      const avgScoreResult = await Application.aggregate([
        { $group: { _id: null, avgScore: { $avg: "$matchScore" } } }
      ]);
      const averageMatchScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore * 10) / 10 : 0;

      const categoryDistribution = await Job.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 }, totalBudget: { $sum: "$budget" } } },
        { $sort: { count: -1 } }
      ]);

      const recentLogs = await ActivityLog.find()
        .populate("userId", "fullName email role")
        .sort({ createdAt: -1 })
        .limit(20);

      return res.status(200).json({
        success: true,
        message: "Platform analytics retrieved successfully",
        data: {
          metrics: {
            totalEmployers,
            totalSeekers,
            totalJobs,
            totalApplications,
            averageMatchScore,
          },
          categoryDistribution,
          recentActivityLogs: recentLogs,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req, res, next) => {
    try {
      const { name, description, icon, parentCategory } = req.body;
      const category = new Category({
        name,
        description,
        icon,
        parentCategory: parentCategory ? new mongoose.Types.ObjectId(parentCategory) : undefined,
      });
      await category.save();

      return res.status(211).json({
        success: true,
        message: "New job category registered",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  getCategories = async (req, res, next) => {
    try {
      const categories = await Category.find().populate("parentCategory", "name");
      return res.status(200).json({
        success: true,
        message: "Categories retrieved",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  };
}
