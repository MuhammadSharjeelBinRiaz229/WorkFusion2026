import { ChatService } from "../services/chat.service.js";
import { ActivityLog } from "../models/ActivityLog.js";
import mongoose from "mongoose";

export class ChatController {
  chatService = new ChatService();

  getChats = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("Unauthorized");
      const chats = await this.chatService.getChats(userId);
      return res.status(200).json({
        success: true,
        message: "Chats retrieved successfully",
        data: chats,
      });
    } catch (error) {
      next(error);
    }
  };

  getMessages = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("Unauthorized");
      const { page = 1, limit = 50 } = req.query;
      const result = await this.chatService.getMessages(
        req.params.chatId,
        userId,
        Number(page),
        Number(limit)
      );
      return res.status(200).json({
        success: true,
        message: "Messages retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  sendMessage = async (req, res, next) => {
    try {
      const senderId = req.user?.id;
      if (!senderId) throw new Error("Unauthorized");
      const message = await this.chatService.sendMessage(senderId, req.body);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(senderId),
        action: "Send Message",
        entity: "Message",
        entityId: message._id,
      });

      return res.status(211).json({
        success: true,
        message: "Message sent successfully",
        data: message,
      });
    } catch (error) {
      next(error);
    }
  };
}
