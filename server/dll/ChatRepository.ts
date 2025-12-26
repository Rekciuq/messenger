import prisma from "../utils/prisma";

class ChatRepository {
    async findById(id: string) {
        return prisma.chat.findUnique({
            where: { id },
        });
    }
    async getUsersChats(userId: string) {
        return prisma.userChat.findMany({
            where: { userId },
            include: {
                chat: {
                    include: {
                        participants: {
                            where: { userId: { not: userId } },
                            include: {
                                user: true,
                            },
                        },
                    messages: {
                        take: 1,
                        orderBy: {
                            createdAt: "desc",
                        },
                        },
                    },
                },
            },
        });
    };
}

export const chatRepository = new ChatRepository();