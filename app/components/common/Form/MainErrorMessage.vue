<script lang="ts" setup>
const { errorMessages, classes = "" } = defineProps<{ errorMessages: string[]; classes?: string }>();

const baseClasses = "text-sm text-accent font-medium flex flex-col gap-1"
const mergedClasses = computed(() =>cn(baseClasses, classes))
</script>

<template>
    <div v-if="errorMessages.length > 0" class="mt-2">
        <span v-for="error in errorMessages" :key="error" :class="mergedClasses">{{ error }}</span>
    </div>
</template>
