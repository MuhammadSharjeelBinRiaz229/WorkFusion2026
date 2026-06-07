import mongoose, { Schema } from "mongoose";
import { ApplicationStatus } from "shared";

const ApplicationSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    seekerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    proposal: { type: String, required: true },
    resume: { type: String },
    portfolio: [{ type: String }],
    expectedSalary: { type: Number, required: true },
    availability: { type: String, required: true },
    estimatedTime: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
      index: true,
    },
    matchScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent candidate from applying to the same job multiple times
ApplicationSchema.index({ jobId: 1, seekerId: 1 }, { unique: true });

export const Application = mongoose.model("Application", ApplicationSchema);
