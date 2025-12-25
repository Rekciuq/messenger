<script lang="ts" setup>
import SendIcon from "~/components/common/icons/SendIcon.vue";

const {
    messageText,
    classes = ""
} = defineProps<{
    messageText: string;
    classes?: string;
}>();

const emit = defineEmits<{
    "update:messageText": [value: string];
    "send": [];
}>();

const localMessageText = computed({
    get: () => messageText,
    set: (value: string) => emit("update:messageText", value)
});

const handleSend = () => {
    if (localMessageText.value.trim()) {
        emit("send");
    }
};

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
    }
};
</script>

<template>
    <div :class="['p-4 border-t border-gray-200 bg-white', classes]">
        <div class="flex items-end gap-3">
            <div class="flex-1 relative">
                <CommonFormFieldsTextAreaField
                    v-model="localMessageText"
                    placeholder="Type a message..."
                    :rows="1"
                    :max-height="120"
                    :auto-resize="true"
                    @keydown="handleKeyDown"
                />
            </div>
            <button
                type="button"
                :disabled="!localMessageText.trim()"
                class="shrink-0 w-12 h-12 rounded-xl bg-brand text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 transition-all shadow-brand disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                @click="handleSend"
            >
                <SendIcon
                    :size="5"
                />
            </button>
        </div>
    </div>
</template>

