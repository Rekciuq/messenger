<script lang="ts" setup>
import BackArrowIcon from "~/components/common/icons/BackArrowIcon.vue";
import UserAvatar from "~/components/dashboard/UserAvatar.vue";

const {
    classes = "",
    imageUrl,
    userName,
    lastSeen = ""
} = defineProps<{
    classes?: string;
    imageUrl: string;
    userName: string;
    lastSeen?: string;
}>();

const emit = defineEmits<{
    "back": [];
}>();
const baseClasses = "flex items-center gap-3 p-4 border-b border-gray-200 bg-white";
const mergedClasses = computed(() => cn(baseClasses, classes));
</script>

<template>
    <div :class="mergedClasses">
        <button
            type="button"
            class="md:hidden shrink-0 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            @click="emit('back')"
        >
            <BackArrowIcon
                :size="5"
                class="text-text-primary"
            />
        </button>
        <div class="relative shrink-0">
            <UserAvatar
                :image-url="imageUrl"
            />
        </div>
        <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-text-primary truncate">{{ userName }}</h3>
            <p class="text-xs text-text-secondary">{{ lastSeen }}</p>
        </div>
    </div>
</template>
