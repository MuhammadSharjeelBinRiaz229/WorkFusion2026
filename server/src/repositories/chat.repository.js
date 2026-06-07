import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";
import mongoose from "mongoose";

export class ChatRepository {
  async createChat(chatData) {
    const chat = new Chat(chatData);
    return await chat.save();
  }

  async findChatById(id) {
    return await Chat.findById(id)
      .populate("jobId", "title status location budget serviceType")
      .populate("employerId", "fullName email profilePicture")
      .populate("seekerId", "fullName email profilePicture");
  }

  async findChatBetweenUsers(jobId, seekerId) {
    return await Chat.findOne({ jobId, seekerId });
  }

  async getChatsForUser(userId) {
    return await Chat.find({
      $or: [
        { employerId: new mongoose.Types.ObjectId(userId) },
        { seekerId: new mongoose.Types.ObjectId(userId) },
      ],
    })
      .populate("jobId", "title status")
      .populate("employerId", "fullName email profilePicture rating")
      .populate("seekerId", "fullName email profilePicture rating")
      .sort({ updatedAt: -1 });
  }

  async createMessage(msgData) {
    const msg = new Message(msgData);
    const saved = await msg.save();
    // Update the parent chat timestamp for sorting
    await Chat.findByIdAndUpdate(msgData.chatId, { updatedAt: new Date() });
    return saved;
  }

  async getMessagesForChat(chatId, options = { page: 1, limit: 10 }) {
    const skip = (options.page - 1) * options.limit;
    const filter = { chatId: new mongoose.Types.ObjectId(chatId) };
    const total = await Message.countDocuments(filter);
    const messages = await Message.find(filter)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(options.limit);
    return { messages, total };
  }

  async markMessagesAsSeen(chatId, userId) {
    // Mark messages sent by others in this chat as seen
    await Message.updateMany(
      { chatId: new mongoose.Types.ObjectId(chatId), senderId: { $ne: new mongoose.Types.ObjectId(userId) } },
      { $set: { seen: true } }
    );
  }
}
