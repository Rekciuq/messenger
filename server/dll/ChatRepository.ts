import prisma from "../utils/prisma";
import type { UserChatsResponse } from "../../app/types/chat";

class ChatRepository {
    async findById(id: string) {
        return prisma.chat.findUniqueOrThrow({
            where: { id },
        });
    }
    async getUsersChats(userId: string): Promise<UserChatsResponse> {
        const takeOneMessage = 1

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
    };
}

export const chatRepository = new ChatRepository();