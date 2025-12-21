<script lang="ts" setup>
const {
    size = "w-5 h-5",
    classes = ""
} = defineProps<{
    size?: string;
    classes?: string;
}>();

const baseClasses = "text-text-secondary";
const mergedClasses = computed(() => cn(baseClasses, size, classes));
</script>

<!-- icon from: https://tabler.io/icons/icon/eye -->
<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="mergedClasses"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
    </svg>
</template>

