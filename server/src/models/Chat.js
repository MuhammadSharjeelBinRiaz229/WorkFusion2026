import mongoose, { Schema } from "mongoose";

const ChatSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    seekerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// A candidate can only have one chat channel per job
ChatSchema.index({ jobId: 1, seekerId: 1 }, { unique: true });

export const Chat = mongoose.model("Chat", ChatSchema);
