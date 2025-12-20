<script lang="ts" setup>

const {
    name,
    label,
    classes = "",
    hasError = false
} = defineProps<{
    name: string;
    label: string;
    classes?: string;
    hasError?:boolean;
}>();

const baseClasses = "";
const mergedClasses = computed(() =>cn(baseClasses, hasError ? "" : "", classes));
</script>

<template>
    <label :for="name" :class="mergedClasses">{{ label }}</label>
</template>
