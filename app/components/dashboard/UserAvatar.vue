<script lang="ts" setup>
import { computed } from "vue";

const {
    imageUrl,
    alt = "User Avatar",
    classes = "",
    isOnline = false
} = defineProps<{
    imageUrl: string;
    alt?: string;
    classes?: string;
    isOnline?: boolean;
}>();

const baseClasses = "w-12 h-12 rounded-full bg-gray-200 relative";
const mergedClasses = computed(() => `${baseClasses} ${classes}`);

const badgeClasses = computed(() => 
    `absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
        isOnline ? "bg-brand-light" : "bg-gray-400"
    }`
);
</script>

<template>
    <div :class="mergedClasses">
        <img
            :src="imageUrl"
            :alt="alt"
            class="w-full h-full object-cover rounded-full"
        >
        <div v-if="isOnline" :class="badgeClasses" />
    </div>
</template>
