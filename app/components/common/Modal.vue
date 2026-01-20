<script lang="ts" setup>
import { cn } from "~/utils/cn";
import CrossIcon from "~/components/common/Form/fields/CrossIcon.vue";

type ButtonConfig = {
    text?: string;
    classes?: string;
    callback?: () => void | Promise<void>;
}

const {
    title,
    isOpen,
    closeButton = true,
    saveButton = undefined,
    closeButtonConfig = {},
    classes = "",
    isLoading = false
} = defineProps<{
    title: string;
    isOpen: boolean;
    closeButton?: boolean;
    saveButton?: ButtonConfig;
    closeButtonConfig?: ButtonConfig;
    classes?: string;
    isLoading?: boolean;
}>();

const emit = defineEmits<{
    "close": [];
    "update:isOpen": [value: boolean];
}>();

const isProcessing = ref(false);

const backdropClasses = "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4";
const modalClasses = "bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden";
const mergedModalClasses = computed(() => cn(modalClasses, classes));

const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
        closeModal();
    }
};

const closeModal = () => {
    if (isProcessing.value) return;
    emit("close");
    emit("update:isOpen", false);
};

const handleCloseButton = async () => {
    if (isProcessing.value) return;
    
    if (closeButtonConfig?.callback) {
        const result = closeButtonConfig.callback();
        if (result instanceof Promise) {
            isProcessing.value = true;
            try {
                await result;
            } finally {
                isProcessing.value = false;
            }
        }
    }
    
    closeModal();
};

const handleSaveButton = async () => {
    if (isProcessing.value || !saveButton?.callback) return;
    
    isProcessing.value = true;
    try {
        await saveButton.callback();
    } finally {
        isProcessing.value = false;
    }
};

watch(() => isOpen, (newValue) => {
    if (newValue) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }
});

onUnmounted(() => {
    document.body.style.overflow = "";
});
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen"
                :class="backdropClasses"
                @click="handleBackdropClick"
            >
                <Transition
                    enter-active-class="transition-all duration-200"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition-all duration-200"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95"
                >
                    <div
                        v-if="isOpen"
                        :class="mergedModalClasses"
                        @click.stop
                    >
                        <!-- Header -->
                        <div class="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
                            <h2 class="text-xl font-semibold text-text-primary">
                                {{ title }}
                            </h2>
                            <button
                                v-if="closeButton"
                                type="button"
                                class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                :disabled="isProcessing"
                                @click="handleCloseButton"
                            >
                                <CrossIcon
                                    size="w-5 h-5"
                                    class="text-text-secondary"
                                />
                            </button>
                        </div>

                        <!-- Content Slot -->
                        <div class="flex-1 min-h-0 overflow-y-auto p-6">
                            <slot />
                        </div>

                        <!-- Footer with Buttons -->
                        <div
                            v-if="closeButton || saveButton"
                            class="shrink-0"
                        >
                            <div class="border-t border-gray-200 p-6">
                                <div class="flex gap-3">
                                    <button
                                        v-if="closeButton"
                                        type="button"
                                        :class="cn(
                                            'flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                                            closeButtonConfig?.classes || 'bg-gray-100 text-text-primary hover:bg-gray-200'
                                        )"
                                        :disabled="isProcessing"
                                        @click="handleCloseButton"
                                    >
                                        {{ closeButtonConfig?.text || "Close" }}
                                    </button>
                                    <button
                                        v-if="saveButton"
                                        type="button"
                                        :class="cn(
                                            'flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                                            saveButton.classes || 'bg-brand text-white hover:bg-brand-dark shadow-brand'
                                        )"
                                        :disabled="isProcessing"
                                        @click="handleSaveButton"
                                    >
                                        <span v-if="!isLoading">{{ saveButton.text || "Save" }}</span>
                                        <span v-else class="flex items-center justify-center gap-2">
                                            <svg
                                                class="animate-spin h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    class="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    stroke-width="4"
                                                />
                                                <path
                                                    class="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Saving...
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>
