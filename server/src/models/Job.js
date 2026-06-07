import mongoose, { Schema } from "mongoose";
import { ServiceType, WorkType, JobStatus } from "shared";

const JobSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    subcategory: { type: String },
    serviceType: {
      type: String,
      enum: Object.values(ServiceType),
      required: true,
    },
    workType: {
      type: String,
      enum: Object.values(WorkType),
      required: true,
    },
    requiredSkills: { type: [String], required: true, index: true },
    experienceRequired: { type: Number, required: true },
    experienceLevel: {
      type: String,
      enum: ["Entry Level", "Intermediate", "Expert"],
      default: "Intermediate",
      required: true,
    },
    timeline: {
      type: String,
      enum: ["Less than 1 month", "1 - 3 months", "3 - 6 months", "More than 6 months"],
      required: false,
    },
    budget: { type: Number, required: true },
    currency: { type: String, default: "PKR" },
    location: { type: String, required: true, index: true },
    remoteAllowed: { type: Boolean, default: false },
    vacancies: { type: Number, default: 1 },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.OPEN,
      index: true,
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", JobSchema);
