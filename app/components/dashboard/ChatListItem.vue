<script lang="ts" setup>
import { getUIUnreadMessagesCount } from "~/utils/chats/getUIUnreadMessagesCount";
import { DateTime } from "luxon";
import { cn } from "~/utils/cn";
import UserAvatar from "~/components/dashboard/UserAvatar.vue";

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

const formatTime = (timestamp: string) => {
  const date = DateTime.fromISO(timestamp);
  const now = DateTime.now();
  const diff = now.diff(date, ['days', 'hours', 'minutes']);

  const minutes = Math.floor(diff.minutes);
  const hours = Math.floor(diff.hours);
  const days = Math.floor(diff.days);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  return date.toLocaleString(DateTime.DATE_MED).toLocaleLowerCase();
};
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

