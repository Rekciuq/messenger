<script lang="ts" setup>

const {
    imageUrl,
    alt = "User Avatar",
    classes = ""
} = defineProps<{
    imageUrl: string;
    alt?: string;
    classes?: string;
}>();

const baseClasses = "w-12 h-12 rounded-full overflow-hidden bg-gray-200";
const mergedClasses = computed(() => cn(baseClasses, classes));
</script>

<template>
    <div :class="mergedClasses">
        <img
            :src="imageUrl"
            :alt="alt"
            class="w-full h-full object-cover"
        />
    </div>
</template>