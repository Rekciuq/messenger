<script lang="ts" setup>
import { cn } from "~/utils/cn";
import LogoutButton from "~/components/dashboard/LogoutButton.vue";
import ProfileButton from "~/components/dashboard/ProfileButton.vue";
import MinimizedChatList from "~/components/dashboard/MinimizedChatList.vue";
import type { ChatView } from "~~/server/bll/ChatService";

const {
    chats,
    selectedChatId = undefined,
    classes = ""
} = defineProps<{
    chats: ChatView[];
    selectedChatId?: string;
    classes?: string;
}>();

const emit = defineEmits<{
    "user-click": [];
    "chat-select": [chatId: string];
}>();

const baseClasses = "flex flex-col h-full";
const mergedClasses = computed(() => cn(baseClasses, classes));

</script>

<template>
    <div :class="mergedClasses">
        <div class="shrink-0 flex justify-center items-center bg-white py-2 rounded-lg shadow-lg">
            <ProfileButton
                class="w-14 h-14"
                @click="emit('user-click')"
            />
        </div>

        <div class="flex-1 min-h-0 overflow-y-auto scrollbar-thin px-1 bg-app-bg">
            <MinimizedChatList
                :chats="chats"
                :selected-chat-id="selectedChatId"
                @chat-select="emit('chat-select', $event)"
            />
        </div>

        <div class="shrink-0 flex items-center justify-center bg-white py-2 rounded-lg shadow-lg">
            <LogoutButton
                variant="icon"
            />
        </div>
    </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
    width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.8);
}
</style>

