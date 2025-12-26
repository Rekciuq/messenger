<script lang="ts" setup>
import { getUIUnreadMessagesCount } from "~/utils/chats/getUIUnreadMessagesCount";
import { cn } from "~/utils/cn";
import UserAvatar from "~/components/dashboard/UserAvatar.vue";
import { formatTime } from "~/utils/chats/formatTime";

interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unreadCount?: number;
    avatarUrl?: string;
}

const {
    chat,
    isActive = false,
    classes = ""
} = defineProps<{
    chat: Chat;
    isActive?: boolean;
    classes?: string;
}>();

const baseClasses = "flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all hover:bg-gray-50";
const activeClasses = "bg-brand/10 border-l-4 border-brand";
const mergedClasses = computed(() => cn(baseClasses, isActive ? activeClasses : "", classes));

</script>

<template>
    <div :class="mergedClasses">
        <div class="relative shrink-0">
            <UserAvatar
                :image-url="chat.avatarUrl"
            />
            <div
                v-if="!!chat.unreadCount"
                class="absolute top-0 right-0 w-5 h-5 rounded-full bg-accent text-white text-xs font-semibold flex items-center justify-center translate-x-1/2 -translate-y-1/2"
            >
                {{ getUIUnreadMessagesCount(chat.unreadCount) }}
            </div>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2 mb-1">
                <h3 class="text-sm font-semibold text-text-primary truncate">{{ chat.name }}</h3>
                <span class="text-xs text-text-secondary shrink-0">{{ formatTime(chat.timestamp) }}</span>
            </div>
            <p class="text-sm text-text-secondary truncate">{{ chat.lastMessage }}</p>
        </div>
    </div>
</template>

