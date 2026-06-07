import { Review } from "../models/Review.js";
import mongoose from "mongoose";

export class ReviewRepository {
  async create(reviewData) {
    const review = new Review(reviewData);
    return await review.save();
  }

  async findById(id) {
    return await Review.findById(id);
  }

  async getReviewsForUser(userId, options = { page: 1, limit: 10 }) {
    const skip = (options.page - 1) * options.limit;
    const filter = { receiver: new mongoose.Types.ObjectId(userId) };
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .populate("reviewer", "fullName email profilePicture role")
      .populate("jobId", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(options.limit);
    return { reviews, total };
  }

  async getAverageRatingForUser(userId) {
    const receiverId = new mongoose.Types.ObjectId(userId);
    const stats = await Review.aggregate([
      { $match: { receiver: receiverId } },
      {
        $group: {
          _id: "$receiver",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length === 0) {
      return { avgRating: 5, count: 0 }; // Default rating 5 with 0 reviews
    }

    return {
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
      count: stats[0].count,
    };
  }
}
