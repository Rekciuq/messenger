import { chatRepository } from "../dll/ChatRepository";
import type { UserChatsResponse, ChatMessage } from "../../app/types/chat";

export interface ParticipantView {
    userId: string;
    bio: string | null;
    email: string;
    isOnline: boolean;
    lastSeen: Date | string;
    userName: string;
    profilePicture: string;
}

export interface ChatView {
    id: string;
    createdAt: Date | string;
    messages: ChatMessage[];
    participant: ParticipantView;
}

export type ChatViewResponse = ChatView[];

export class ChatService {
    private mapToChatView(data: UserChatsResponse): ChatViewResponse {
        return data.map((userChat) => {
            const chat = userChat.chat;
            const participantData = chat.participants[0];
            
            if (!participantData) {
                throw new Error(`Chat ${chat.id} has no participants`);
            }

            const participantView: ParticipantView = {
                userId: participantData.user.id,
                bio: participantData.user.bio,
                email: participantData.user.email,
                userName: participantData.user.userName,
                isOnline: participantData.user.isOnline,
                lastSeen: participantData.user.lastSeen,
                profilePicture: participantData.user.profilePicture.url,
            };

            const chatView: ChatView = {
                id: chat.id,
                createdAt: chat.createdAt,
                messages: chat.messages,
                participant: participantView,
            };

            return chatView;
        });
    }

    async getChatsById(userId: string): Promise<ChatViewResponse> {
        const data = await chatRepository.getUsersChats(userId);
        return this.mapToChatView(data);
    }
}

export const chatService = new ChatService();