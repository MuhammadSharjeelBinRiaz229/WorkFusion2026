import { ChatRepository } from "../repositories/chat.repository.js";
import { ApplicationRepository } from "../repositories/application.repository.js";
import { MessageType, NotificationType, ApplicationStatus } from "shared";
import { Notification } from "../models/Notification.js";
import { logger } from "../utils/logger.js";

export class ChatService {
  chatRepo = new ChatRepository();
  appRepo = new ApplicationRepository();

  async getChats(userId) {
    return await this.chatRepo.getChatsForUser(userId);
  }

  async getMessages(chatId, userId, page, limit) {
    const chat = await this.chatRepo.findChatById(chatId);
    if (!chat) {
      throw new Error("Chat conversation not found");
    }

    const empId = chat.employerId._id ? chat.employerId._id.toString() : chat.employerId.toString();
    const seekId = chat.seekerId._id ? chat.seekerId._id.toString() : chat.seekerId.toString();

    if (empId !== userId && seekId !== userId) {
      throw new Error("Unauthorized access to this chat conversation");
    }

    await this.chatRepo.markMessagesAsSeen(chatId, userId);

    return await this.chatRepo.getMessagesForChat(chatId, { page, limit });
  }

  async sendMessage(senderId, input) {
    const chat = await this.chatRepo.findChatById(input.chatId);
    if (!chat) {
      throw new Error("Chat conversation not found");
    }

    const empId = chat.employerId._id ? chat.employerId._id.toString() : chat.employerId.toString();
    const seekId = chat.seekerId._id ? chat.seekerId._id.toString() : chat.seekerId.toString();

    if (empId !== senderId && seekId !== senderId) {
      throw new Error("Unauthorized to send messages in this chat conversation");
    }

    const application = await this.appRepo.findByJobAndSeeker(
      chat.jobId._id ? chat.jobId._id.toString() : chat.jobId.toString(),
      seekId
    );

    if (!application) {
      throw new Error("Application not found for this candidate.");
    }

    const allowedStatuses = [
      ApplicationStatus.INTERVIEW,
      ApplicationStatus.ACCEPTED,
      ApplicationStatus.HIRED,
      ApplicationStatus.COMPLETED,
    ];

    if (!allowedStatuses.includes(application.status)) {
      throw new Error(
        `Messaging is disabled. Chat becomes available only after reaching the Interview stage. Current status: ${application.status}`
      );
    }

    const messageData = {
      ...input,
      senderId,
      seen: false,
    };

    const message = await this.chatRepo.createMessage(messageData);
    logger.info(`Message sent in Chat ${input.chatId} by Sender ${senderId}`);

    const recipientId = senderId === empId ? seekId : empId;
    const senderName = senderId === empId ? chat.employerId.fullName : chat.seekerId.fullName;

    await Notification.create({
      userId: recipientId,
      title: `New message from ${senderName}`,
      body: input.type === MessageType.TEXT ? input.message : `Sent a file attachment: ${input.type}`,
      type: NotificationType.MESSAGE,
    });

    return message;
  }
}
