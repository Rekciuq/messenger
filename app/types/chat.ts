export interface ChatImage {
    id: string
    url: string
    createdAt: Date | string
    updatedAt: Date | string
}

export interface ChatUser {
    id: string
    email: string
    userName: string
    bio: string | null
    lastSeen: Date | string
    isOnline: boolean
    createdAt: Date | string
    updatedAt: Date | string
    profilePicture: ChatImage
}

export interface ChatMessage {
    id: string
    text: string
    createdAt: Date | string
    senderId: string
    chatId: string
}

export interface ChatParticipant {
    id: string
    createdAt: Date | string
    updatedAt: Date | string
    userId: string
    chatId: string
    user: ChatUser
}

export interface ChatWithDetails {
    id: string
    createdAt: Date | string
    updatedAt: Date | string
    participants: ChatParticipant[]
    messages: ChatMessage[]
}

export interface UserChatWithDetails {
    id: string
    createdAt: Date | string
    updatedAt: Date | string
    userId: string
    chatId: string
    chat: ChatWithDetails
}

export type UserChatsResponse = UserChatWithDetails[]
