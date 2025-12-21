<script lang="ts" setup>
const {classes = ""} = defineProps<{classes?: string}>()

const baseClasses = "bg-white rounded-2xl shadow-lg p-8 w-full max-w-md";
const mergedClasses = computed(() => cn(baseClasses, classes))
</script>

<template>
    <div :class="mergedClasses">
        <slot />
    </div>
</template>