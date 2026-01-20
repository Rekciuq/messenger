<script lang="ts" setup>
import UserProfile from "~/components/dashboard/UserProfile.vue";
import ChatList from "~/components/dashboard/ChatList.vue";
import MinimizedSidebar from "~/components/dashboard/MinimizedSidebar.vue";
import LogoutButton from "~/components/dashboard/LogoutButton.vue";
import type { ChatView } from "~~/server/bll/ChatService";

const {
    chats = [],
    selectedChatId = ""
} = defineProps<{
    chats?: ChatView[];
    selectedChatId?: string;
}>();

const emit = defineEmits<{
    "user-click": [];
    "chat-select": [chatId: string];
}>();



const authStore = useAuthStore();

const {userEmail, userProfilePicture, lastSeen, isOnline} = storeToRefs(authStore);

const user = computed(() => ({
    email: userEmail.value,
    profilePicture: userProfilePicture.value,
    lastSeen: lastSeen.value.toString(),
    isOnline: isOnline.value
}))

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
                class="h-full shadow-lg"
            >
                <MinimizedSidebar
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
                    :user="user"
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

