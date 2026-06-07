import mongoose, { Schema } from "mongoose";
import { MessageType } from "shared";

const MessageSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageType.TEXT,
    },
    message: { type: String, required: true },
    attachment: { type: String, default: "" },
    seen: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Message = mongoose.model("Message", MessageSchema);
