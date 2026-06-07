import mongoose, { Schema } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);
