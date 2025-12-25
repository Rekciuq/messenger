<script lang="ts" setup>
import UserProfile from "~/components/dashboard/UserProfile.vue";
import ChatList from "~/components/dashboard/ChatList.vue";
import MinimizedSidebar from "~/components/dashboard/MinimizedSidebar.vue";
import LogoutButton from "~/components/dashboard/LogoutButton.vue";

interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unreadCount?: number;
    avatarUrl?: string;
}

const {
    userEmail,
    userProfilePictureUrl,
    chats,
    selectedChatId = ""
} = defineProps<{
    userEmail: string;
    userProfilePictureUrl: string;
    chats: Chat[];
    selectedChatId?: string;
}>();

const emit = defineEmits<{
    "user-click": [];
    "chat-select": [chatId: string];
}>();

const lastSeen = computed(() => {
    return "Online";
});
</script>

<template>
    <div
        :class="[
            'transition-all duration-300 ease-in-out',
            'md:block',
            selectedChatId ? 'hidden md:block md:w-24' : 'w-full md:w-80'
        ]"
    >
        <div
            :class="[
                'h-screen flex flex-col transition-all duration-300 ease-in-out',
                selectedChatId ? 'px-2 py-4 md:py-6 md:px-3' : 'p-4 md:p-6',
            ]"
        >
            <div
                v-if="selectedChatId"
                class="h-full"
            >
                <MinimizedSidebar
                    :user-email="userEmail"
                    :user-profile-picture-url="userProfilePictureUrl || ''"
                    :chats="chats"
                    :selected-chat-id="selectedChatId"
                    @user-click="emit('user-click')"
                    @chat-select="emit('chat-select', $event)"
                />
            </div>
            <div
                v-else
                class="flex flex-col h-full"
            >
                <div class="shrink-0 mb-6">
                    <h1 class="text-2xl md:text-3xl font-bold text-text-primary mb-2 whitespace-nowrap">Messages</h1>
                    <p class="text-sm text-text-secondary whitespace-nowrap">Your conversations</p>
                </div>

                <UserProfile
                    :email="userEmail"
                    :profile-picture-url="userProfilePictureUrl"
                    :last-seen="lastSeen"
                    :classes="'shrink-0 mb-6'"
                    @click="emit('user-click')"
                />

                <div class="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col flex-1 min-h-0">
                    <div class="shrink-0 mb-4">
                        <h2 class="text-lg font-semibold text-text-primary">Chats</h2>
                    </div>
                    <div class="flex-1 min-h-0 overflow-y-auto">
                        <ChatList
                            :chats="chats"
                            :selected-chat-id="selectedChatId"
                            @chat-select="emit('chat-select', $event)"
                        />
                    </div>
                    <div class="shrink-0">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

