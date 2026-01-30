import prisma from "../utils/prisma";
import type { UserChatsResponse } from "../../app/types/chat";

class ChatRepository {
  async findById(id: string) {
    return prisma.chat.findUniqueOrThrow({
      where: { id },
    });
  }
  async getUsersChats(userId: string): Promise<UserChatsResponse> {
    const takeOneMessage = 1;

    return prisma.userChat.findMany({
      where: { userId },
      include: {
        chat: {
          include: {
            participants: {
              where: { userId: { not: userId } },
              include: {
                user: {
                  include: {
                    profilePicture: true,
                  },
                },
              },
            },
            messages: {
              take: takeOneMessage,
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    }) as Promise<UserChatsResponse>;
  }

  async findChatBetweenUsers(userId1: string, userId2: string) {
    const chat = await prisma.chat.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                userId: userId1,
              },
            },
          },
          {
            participants: {
              some: {
                userId: userId2,
              },
            },
          },
        ],
      },
    });

    return chat;
  }

  async createChat(userId1: string, userId2: string) {
    return prisma.chat.create({
      data: {
        participants: {
          create: [{ userId: userId1 }, { userId: userId2 }],
        },
      },
    });
  }
}

export const chatRepository = new ChatRepository();
