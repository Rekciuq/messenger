<script lang="ts" setup>
import { getUIUnreadMessagesCount } from "~/utils/chats/getUIUnreadMessagesCount";
import { cn } from "~/utils/cn";
import UserAvatar from "~/components/dashboard/UserAvatar.vue";

interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unreadCount?: number;
    avatarUrl: string;
}

const {
    chats = [],
    selectedChatId,
    classes = ""
} = defineProps<{
    chats: Chat[];
    selectedChatId?: string;
    classes?: string;
}>();

const emit = defineEmits<{
    "chat-select": [chatId: string];
}>();

const baseClasses = "flex flex-col gap-5 py-2";
const mergedClasses = computed(() => cn(baseClasses, classes));
</script>

<template>
    <div :class="mergedClasses">
        <div
            v-for="(chat, index) in chats"
            :key="`${chat.id}-${index}`"
            class="relative shrink-0 flex justify-center"
        >
            <button
                type="button"
                :class="cn(
                    'relative rounded-full overflow-visible transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2',
                    'w-14 h-14',
                    selectedChatId === chat.id ? 'ring-2 ring-brand ring-offset-2' : ''
                )"
                @click="emit('chat-select', chat.id)"
            >
                <div class="w-full h-full rounded-full overflow-hidden">
                    <UserAvatar
                        :image-url="chat.avatarUrl"
                        :classes="'w-full h-full'"
                    />
                </div>
                <div
                    v-if="!!chat.unreadCount"
                    class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-xs font-semibold flex items-center justify-center z-10"
                >
                    {{ getUIUnreadMessagesCount(chat.unreadCount) }}
                </div>
            </button>
        </div>
    </div>
</template>

