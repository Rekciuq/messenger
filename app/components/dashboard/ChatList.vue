<script lang="ts" setup>
import ChatListItem from "./ChatListItem.vue";
import type { ChatView } from "~~/server/bll/ChatService";

const {
    chats = [],
    selectedChatId = "",
    classes = ""
} = defineProps<{
    chats?: ChatView[];
    selectedChatId?: string;
    classes?: string;
}>();

const emit = defineEmits<{
    "chat-select": [chatId: string];
}>();

const handleChatClick = (chatId: string) => {
    emit("chat-select", chatId);
};
</script>

<template>
    <div :class="classes">
        <div class="space-y-1">
            <ChatListItem
                v-for="chat in chats"
                :key="chat.id"
                :chat="chat"
                :is-active="chat.id === selectedChatId"
                @click="handleChatClick(chat.id)"
            />
        </div>
        <div
            v-if="chats.length === 0"
            class="text-center py-12 text-text-secondary"
        >
            <p class="text-sm">No chats yet</p>
            <p class="text-xs mt-1">Start a new conversation</p>
        </div>
    </div>
</template>

