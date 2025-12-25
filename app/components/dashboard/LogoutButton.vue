<script lang="ts" setup>
import { cn } from "~/utils/cn";
import LogoutIcon from "~/components/common/icons/LogoutIcon.vue";
import SpinnerIcon from "~/components/common/icons/SpinnerIcon.vue";

const {
    variant = "full",
    classes = ""
} = defineProps<{
    variant?: "full" | "icon";
    classes?: string;
}>();

const isLoading = ref(false);

const handleLogout = async () => {
    if (isLoading.value) return;
    
    isLoading.value = true;
    try {
        await $fetch('/api/v1/auth/logout', { method: 'POST' });
        await navigateTo('/login');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        isLoading.value = false;
    }
};

const isFullVariant = computed(() => variant === "full");
const isIconVariant = computed(() => variant === "icon");

const buttonClasses = computed(() => {
    if (isFullVariant.value) {
        return cn(
            "w-full mt-4 px-4 py-2.5 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all shadow-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
            classes
        );
    }
    return cn(
        "w-14 h-14 rounded-full bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all shadow-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center",
        classes
    );
});

const iconSize = computed(() => isFullVariant.value ? 4 : 5);
</script>

<template>
    <button
        :disabled="isLoading"
        :class="buttonClasses"
        @click="handleLogout"
    >
        <SpinnerIcon
            v-if="isLoading"
            :size="iconSize"
            class="text-white"
        />
        <LogoutIcon
            v-else
            :size="iconSize"
            :class="isIconVariant ? 'text-white' : ''"
        />
        <span v-if="isFullVariant">{{ isLoading ? 'Logging out...' : 'Logout' }}</span>
    </button>
</template>

