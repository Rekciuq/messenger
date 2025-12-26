<script lang="ts" setup>
import { useAuthStore } from "~/stores/auth";
import SpinnerIcon from "~/components/common/icons/SpinnerIcon.vue";

const authStore = useAuthStore();

onBeforeMount(async () => {
    await authStore.initialize();
});

const loading = computed(() => authStore.isLoading && !authStore.isInitialized);
</script>

<template>
    <div>
        <slot v-if="!loading" />
        <div v-else>
            <div class="flex items-center justify-center h-screen">
                <SpinnerIcon :size="6" />
            </div>
        </div>
    </div>
</template>

