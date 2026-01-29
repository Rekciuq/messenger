import type { Pagination } from "../../app/types/pagination";

class MessageRepository {
  async createMessage(data: {
    text: string;
    senderId: string;
    chatId: string;
  }) {
    return prisma.message.create({ data });
  }

  async getMessagesByChatId(chatId: string, pagination: Pagination) {
    const skip = (pagination.page - 1) * pagination.limit;

    return prisma.message.findMany({
      where: { chatId },
      skip,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
    });
  }

  async getMessageCount(chatId: string): Promise<number> {
    return prisma.message.count({
      where: { chatId },
    });
  }
}

export const messageRepository = new MessageRepository();
