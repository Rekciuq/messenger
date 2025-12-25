<script lang="ts" setup>
import ChatView from "~/components/dashboard/ChatView.vue";
import Sidebar from "~/components/dashboard/Sidebar.vue";

definePageMeta({
    layout: "app",
});

const selectedChatId = ref<string | undefined>(undefined);

const selectedChat = computed(() => {
    if (!selectedChatId.value) return null;
    return chats.find(chat => chat.id === selectedChatId.value) || null;
});

const handleChatSelect = (chatId: string) => {
    selectedChatId.value = chatId;
};

const handleUserClick = () => {
    selectedChatId.value = undefined;
};

const handleSendMessage = (message: string) => {
    console.log("Sending message to chat", selectedChatId.value, ":", message);
};

const handleChatBack = () => {
    selectedChatId.value = undefined;
};
const userEmail = "user@example.com";
const userProfilePicture = "https://via.placeholder.com/150";
</script>

<template>
    <div class="min-h-screen bg-app-bg flex flex-col md:flex-row">
        <Sidebar
            :user-email="userEmail"
            :user-profile-picture-url="userProfilePicture"
            :chats="chats"
            :selected-chat-id="selectedChatId"
            @user-click="handleUserClick"
            @chat-select="handleChatSelect"
        />

        <div
            :class="[
                'flex-1',
                selectedChatId ? 'block' : 'hidden md:block',
                'p-4 md:p-6'
            ]"
        >
            <ChatView
                :chat-user="{
                    imageUrl: 'https://via.placeholder.com/150',
                    userName: 'John Doe',
                    lastSeen: 'Online',
                }"
                class="h-full"
                @send-message="handleSendMessage"
                @back="handleChatBack"
            />
        </div>
    </div>
</template>
