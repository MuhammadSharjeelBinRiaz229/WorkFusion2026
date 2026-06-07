import mongoose, { Schema } from "mongoose";

const BookmarkSchema = new Schema(
  {
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
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

BookmarkSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const Bookmark = mongoose.model("Bookmark", BookmarkSchema);
