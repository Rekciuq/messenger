import { chatRepository } from "../dll/ChatRepository";

export class ChatService {
    async getChatById(userId: string) {
        return await chatRepository.getUsersChats(userId);
    }
}

export const chatService = new ChatService();