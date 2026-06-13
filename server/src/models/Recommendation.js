import mongoose, { Schema } from "mongoose";

const RecommendationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
    index: true,
  },
  score: { type: Number, required: true },
  reason: [{ type: String }],
  missingSkills: [{ type: String }],
  generatedAt: { type: Date, default: Date.now },
});

// Avoid duplicate cache matches
RecommendationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const Recommendation = mongoose.model("Recommendation", RecommendationSchema);
