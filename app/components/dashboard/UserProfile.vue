<script lang="ts" setup>
import { cn } from "~/utils/cn";
import UserAvatar from "~/components/dashboard/UserAvatar.vue";

const {
    email = "user@example.com",
    profilePictureUrl,
    classes = "",
    lastSeen = ""
} = defineProps<{
    email?: string;
    profilePictureUrl: string;
    classes?: string;
    lastSeen?: string;
}>();

const emit = defineEmits<{
    "click": [];
}>();

const baseClasses = "flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all";
const mergedClasses = computed(() => cn(baseClasses, classes));
</script>

<template>
    <div :class="mergedClasses" @click="emit('click')">
        <div class="relative shrink-0">
            <UserAvatar
                :image-url="profilePictureUrl"
            />
        </div>
        <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-text-primary truncate">{{ email }}</p>
            <p class="text-xs text-text-secondary">{{ lastSeen }}</p>
        </div>
    </div>
</template>

