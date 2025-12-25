<script lang="ts" setup>
import { cn } from "~/utils/cn";
import ChatHeader from "~/components/dashboard/ChatHeader.vue";
import ChatInputArea from "~/components/dashboard/ChatInputArea.vue";

const {
    classes = "",
    chatUser = null,
} = defineProps<{
    classes?: string;
    chatUser?: {
        imageUrl: string;
        userName: string;
        lastSeen: string;
    };
}>();

const emit = defineEmits<{
    "send-message": [message: string];
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

</script>

<template>
    <div v-if="chatUser" :class="mergedClasses">
        <ChatHeader
            :image-url="chatUser.imageUrl"
            :user-name="chatUser.userName"
            :last-seen="chatUser.lastSeen"
            @back="emit('back')"
        />

        <div class="flex-1 overflow-y-auto p-4 bg-app-bg">
            <div class="flex items-center justify-center h-full">
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

