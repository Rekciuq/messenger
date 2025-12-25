<script lang="ts" setup>
import { cn } from "~/utils/cn";

const {
    classes = "",
    size = 4
} = defineProps<{
    classes?: string;
    size?: number;
}>();

const sizeClasses = computed(() => {
    const sizeMap: Record<number, string> = {
        3: "w-3 h-3",
        4: "w-4 h-4",
        5: "w-5 h-5",
        6: "w-6 h-6",
    };
    return sizeMap[size] || "w-4 h-4";
});

const mergedClasses = computed(() => cn(sizeClasses.value, classes));
</script>

<template>
    <svg
        :class="mergedClasses"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
    </svg>
</template>

