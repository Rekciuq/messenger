<script lang="ts" setup>
import { cn } from "~/utils/cn";
import ChatHeader from "~/components/dashboard/ChatHeader.vue";
import ChatInputArea from "~/components/dashboard/ChatInputArea.vue";
import type { ChatView } from "~~/server/bll/ChatService";
import MainCard from "../common/MainCard.vue";
import { DateTime } from "luxon";

const {
    classes = "",
    chat = null,
} = defineProps<{
    classes?: string;
    chat?: ChatView;
}>();

const emit = defineEmits<{
    "send-message": [message: string];
    "open-user-info-modal": [];
    "back": [];
}>();

const messageText = ref("");

const handleSend = () => {
    if (messageText.value.trim()) {
        emit("send-message", messageText.value.trim());
        messageText.value = "";
    }
};

const baseClasses = "flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden";
const mergedClasses = computed(() => cn(baseClasses, classes));

const authStore = useAuthStore();

const userId = computed(() => authStore.session?.id)
const formatMessageTime = (dateString: string) => {
  const messageTime = DateTime.fromISO(dateString);
  const now = DateTime.now();

  if (messageTime.hasSame(now, "day")) {
    return messageTime.toFormat("HH:mm");
  }

  if (messageTime.hasSame(now.minus({ days: 1 }), "day")) {
    return `Yesterday ${messageTime.toFormat("HH:mm")}`;
  }

  if (messageTime.hasSame(now, "year")) {
    return messageTime.toFormat("MMM d, HH:mm");
  }

  return messageTime.toFormat("MMM d, yyyy, HH:mm");
}

</script>

<template>
    <div v-if="chat" :class="mergedClasses">
        <ChatHeader
            :participant="chat.participant"
            @back="emit('back')"
            @open-user-info-modal="emit('open-user-info-modal')"
        />

        <div class="flex-1 overflow-y-auto p-4 bg-app-bg">
            <div v-if="chat.messages.length">
                <MainCard v-for="message in chat.messages" :key="message.id" :classes="cn('max-w-1/2 w-fit', userId === message.senderId ? 'float-right': 'float-left')">
                    <p class="">{{ formatMessageTime(message.createdAt.toLocaleString()) }}</p>
                    <p class="">{{ message.text }}</p>

                </MainCard>
            </div>
            <div v-else class="flex items-center justify-center h-full">
                <p class="text-sm text-text-secondary">No messages yet. Start the conversation!</p>
            </div>
        </div>

        <ChatInputArea
            v-model:message-text="messageText"
            @send="handleSend"
        />
    </div>
    <div
        v-else
        :class="cn('flex items-center justify-center h-full bg-white rounded-2xl shadow-lg', classes)"
    >
        <div class="text-center">
            <p class="text-sm text-text-secondary">Select a chat to start messaging</p>
        </div>
    </div>
</template>
