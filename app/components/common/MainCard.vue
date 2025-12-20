<script lang="ts" setup>

const {classes = ""} = defineProps<{classes?: string}>()

const baseClasses = "";
const mergedClasses = computed(() => cn(baseClasses, classes))
</script>

<template>
    <div :class="mergedClasses">
        <slot />
    </div>
</template>