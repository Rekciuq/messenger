<script lang="ts" setup>
import { cn } from "~/utils/cn";
import UserAvatar from "~/components/dashboard/UserAvatar.vue";
import { formatTime } from "~/utils/chats/formatTime";
import type { ChatView } from "~~/server/bll/ChatService";

const {
    chat,
    isActive = false,
    classes = ""
} = defineProps<{
    chat: ChatView;
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
                :image-url="chat.participant.profilePicture"
            />
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2 mb-1">
                <h3 class="text-sm font-semibold text-text-primary truncate">{{ chat.participant.email }}</h3>
                <span class="text-xs text-text-secondary shrink-0">{{ formatTime(chat.messages[0]!.createdAt.toString()) }}</span>
            </div>
            <p class="text-sm text-text-secondary truncate">{{ chat.messages[0]?.text }}</p>
        </div>
    </div>
</template>
