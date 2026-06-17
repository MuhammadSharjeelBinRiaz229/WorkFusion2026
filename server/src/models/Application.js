import mongoose, { Schema } from "mongoose";
import { ApplicationStatus } from "shared";

const StatusHistorySchema = new Schema(
  {
    status: { type: String, enum: Object.values(ApplicationStatus), required: true },
    changedBy: { type: Schema.Types.ObjectId, ref: "User" },
    note: { type: String, default: "" },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ApplicationSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    seekerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
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
    // Interview metadata
    interviewDate: { type: Date, default: null },
    interviewNote: { type: String, default: "" },
    // Offer metadata
    offerNote: { type: String, default: "" },
    // Full audit trail
    statusHistory: { type: [StatusHistorySchema], default: [] },
  },
  { timestamps: true }
);

// Prevent candidate from applying to the same job multiple times
ApplicationSchema.index({ jobId: 1, seekerId: 1 }, { unique: true });

export const Application = mongoose.model("Application", ApplicationSchema);
