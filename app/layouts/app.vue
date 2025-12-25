<script lang="ts" setup>
interface SessionData {
    id: string;
    email: string;
    userName: string;
    bio?: string;
    profilePictureId?: string;
}

interface SessionResponse {
    success: boolean;
    data?: SessionData;
}

// Fetch session data on layout mount
const session = ref<SessionData | null>(null);
const loading = ref(true);

onMounted(async () => {
    try {
        const response = await $fetch<SessionResponse>('/api/v1/auth/session');
        if (response && response.data) {
            session.value = response.data;
        }
    } catch (error) {
        console.error('Failed to fetch session:', error);
    } finally {
        loading.value = false;
    }
});

// Provide session to child components
provide('session', session);
provide('sessionLoading', loading);
</script>

<template>
    <div>
        <slot />
    </div>
</template>

