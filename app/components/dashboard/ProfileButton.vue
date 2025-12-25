<script lang="ts" setup>
import { cn } from "~/utils/cn";
import UserAvatar from "~/components/dashboard/UserAvatar.vue";

const {
    imageUrl,
    classes = ""
} = defineProps<{
    imageUrl: string;
    classes?: string;
}>();

const emit = defineEmits<{
    "click": [];
}>();

const baseClasses = "relative rounded-full overflow-hidden bg-brand hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2";
const mergedClasses = computed(() => cn(baseClasses, classes));
</script>

<template>
    <button
        :class="mergedClasses"
        @click="emit('click')"
    >
        <UserAvatar
            :image-url="imageUrl!"
            :classes="'w-full h-full'"
        />
    </button>
</template>

