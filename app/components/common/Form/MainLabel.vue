<script lang="ts" setup>

const {
    name,
    label = "",
    classes = "",
    hasError = false
} = defineProps<{
    name: string;
    label?: string;
    classes?: string;
    hasError?:boolean;
}>();

const baseClasses = "block text-sm font-medium text-text-primary mb-2";
const mergedClasses = computed(() =>cn(baseClasses, hasError ? "text-accent" : "", classes));
</script>

<template>
    <label v-if="label" :for="name" :class="mergedClasses">
        {{ label }}
    </label>
    <slot v-else />
</template>
