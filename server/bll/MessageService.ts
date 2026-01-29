import type { Message } from "~/generated/prisma/client";
import type { Pagination } from "../../app/types/pagination";
import { messageRepository } from "../dll/MessageRepository";

export type MessageView = {
  id: string;
  text: string;
  createdAt: string;
  senderId: string;
  chatId: string;
};

class MessageService {
  private mapToMessageView(message: Message): MessageView {
    return {
      id: message.id,
      text: message.text,
      createdAt: message.createdAt.toISOString(),
      senderId: message.senderId,
      chatId: message.chatId,
    };
  }

  async createMessage(data: {
    text: string;
    senderId: string;
    chatId: string;
  }): Promise<MessageView> {
    const message = await messageRepository.createMessage(data);
    return this.mapToMessageView(message);
  }
  async getMessagesByChatId(chatId: string, pagination: Pagination) {
    const messages = await messageRepository.getMessagesByChatId(
      chatId,
      pagination,
    );

    const mappedMessages = messages
      .map((message) => this.mapToMessageView(message))
      .reverse();

    return {
      messages: mappedMessages,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
      },
    };
  }

  async getMessageCount(chatId: string): Promise<number> {
    return messageRepository.getMessageCount(chatId);
  }
}

export const messageService = new MessageService();
