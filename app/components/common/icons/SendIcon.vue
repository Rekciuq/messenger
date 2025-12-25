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
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
</template>

