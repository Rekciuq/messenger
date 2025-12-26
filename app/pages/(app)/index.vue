<script lang="ts" setup>
import ChatView from "~/components/dashboard/ChatView.vue";
import Sidebar from "~/components/dashboard/Sidebar.vue";

definePageMeta({
    layout: "app",
});


const selectedChatId = ref<string | undefined>(undefined);

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

const chats = [
    {
        id: "1",
        name: "John Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
    {
        id: "2",
        name: "Jane Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
    {
        id: "3",
        name: "Jim Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
    {
        id: "1",
        name: "John Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
    {
        id: "2",
        name: "Jane Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
    {
        id: "3",
        name: "Jim Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
    {
        id: "1",
        name: "John Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
    {
        id: "2",
        name: "Jane Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
    {
        id: "3",
        name: "Jim Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
    {
        id: "1",
        name: "John Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
    {
        id: "2",
        name: "Jane Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
    {
        id: "3",
        name: "Jim Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
    {
        id: "1",
        name: "John Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
    {
        id: "2",
        name: "Jane Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
    {
        id: "3",
        name: "Jim Doe",
        lastMessage: "Hello, how are you?",
        timestamp: "2021-01-01",
    },
];
</script>
<template>
    <div class="min-h-screen bg-app-bg flex flex-col md:flex-row">
        <Sidebar
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
