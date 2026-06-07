import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Prevent reviewer from leaving multiple reviews for the same job receiver
ReviewSchema.index({ jobId: 1, reviewer: 1, receiver: 1 }, { unique: true });

export const Review = mongoose.model("Review", ReviewSchema);
