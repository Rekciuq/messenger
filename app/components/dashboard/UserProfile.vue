<script lang="ts" setup>
import { cn } from "~/utils/cn";
import UserAvatar from "~/components/dashboard/UserAvatar.vue";
import { formatTime } from "~/utils/chats/formatTime";

type UserProfileProps = {
    isOnline: boolean;
    lastSeen: string;
    profilePicture: string;
    email: string;
}

const {
    classes = "",
    user,
    showStatus = false
} = defineProps<{
    classes?: string;
    user: UserProfileProps;
    showStatus?: boolean;
}>();

const emit = defineEmits<{
    "click": [];
}>();

const baseClasses = "flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all";
const mergedClasses = computed(() => cn(baseClasses, classes));
const lastSeenText = computed(() => {
    if (user.isOnline) {
        return "Online";
    }

    return formatTime(user.lastSeen);
});
</script>

<template>
    <div :class="mergedClasses" @click="emit('click')">
        <div class="relative shrink-0">
            <UserAvatar
                :image-url="user.profilePicture"
                :is-online="showStatus ? user.isOnline: false"
            />
        </div>
        <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-text-primary truncate">{{ user.email }}</p>
            <p v-if="showStatus" class="text-xs text-text-secondary">{{ lastSeenText }}</p>
        </div>
    </div>
</template>

