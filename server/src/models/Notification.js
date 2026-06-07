import mongoose, { Schema } from "mongoose";
import { NotificationType } from "shared";

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification = mongoose.model("Notification", NotificationSchema);
