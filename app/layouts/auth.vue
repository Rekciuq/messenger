<script lang="ts" setup>
import { AUTH_TEXTS } from "~/constants/auth/texts";

const route = useRoute();
const authTexts = computed(() => route.fullPath.includes("login") ? AUTH_TEXTS.login : AUTH_TEXTS.signup);
</script>

<template>
    <div class="min-h-screen bg-app-bg flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md space-y-8">
            <div class="text-center space-y-4">
                <div class="flex justify-center">
                    <MainIcon />
                </div>
                <div class="space-y-2">
                    <h1 class="text-3xl font-bold text-text-primary">{{ AUTH_TEXTS.common.welcomeTitle }}</h1>
                    <div class="space-y-1">
                        <h2 class="text-xl font-semibold text-text-primary">{{ authTexts.title }}</h2>
                        <p class="text-sm text-text-secondary">{{ authTexts.subtitle }}</p>
                    </div>
                </div>
            </div>
            <slot />
            <div class="text-center">
                <p class="text-sm text-text-secondary">
                    {{ authTexts.oppositePageText }}
                    <NuxtLink 
                        :to="authTexts.oppositePageLink" 
                        class="text-brand font-medium hover:text-brand-dark transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 rounded"
                    >
                        {{ authTexts.oppositePageLinkText }}
                    </NuxtLink>
                </p>
            </div>
        </div>
    </div>
</template>
