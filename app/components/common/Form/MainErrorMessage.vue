<script lang="ts" setup>
const { errorMessages, classes = "" } = defineProps<{ errorMessages: string[]; classes?: string }>();

const baseClasses = ""
const mergedClasses = computed(() =>cn(baseClasses, errorMessages ? "":"", classes))
</script>

<template>
    <div v-for="error in errorMessages" :key="error">
    <span :class="mergedClasses">{{ error }}</span>
    </div>
</template>
