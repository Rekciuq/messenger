<script lang="ts" setup>
  import { DateTime } from "luxon";
  import type { ChatMessage } from "~/types/chat";
  import { MessageStatus } from "~/types/chat";
  import { cn } from "~/utils/cn";
  import SpinnerIcon from "~/components/common/icons/SpinnerIcon.vue";

  const { message, isOwn } = defineProps<{
    message: ChatMessage;
    isOwn: boolean;
  }>();

  const emit = defineEmits<{
    retry: [message: ChatMessage];
  }>();

  const formattedTime = computed(() => {
    const messageTime = DateTime.fromISO(message.createdAt);
    const now = DateTime.now();

    if (messageTime.hasSame(now, "day")) {
      return messageTime.toFormat("HH:mm");
    }

    if (messageTime.hasSame(now.minus({ days: 1 }), "day")) {
      return `Yesterday ${messageTime.toFormat("HH:mm")}`;
    }

    if (messageTime.hasSame(now, "year")) {
      return messageTime.toFormat("MMM d, HH:mm");
    }

    return messageTime.toFormat("MMM d, yyyy, HH:mm");
  });

  const rowClasses = computed(() =>
    cn("flex w-full", isOwn ? "justify-end" : "justify-start"),
  );

  const bubbleClasses = computed(() =>
    cn(
      "max-w-[70%] rounded-2xl px-4 py-3 shadow-lg wrap-break-word",
      isOwn
        ? "bg-brand text-white shadow-brand"
        : "bg-white text-text-primary border border-gray-200",
    ),
  );

  const handleRetry = () => {
    emit("retry", message);
  };
</script>

<template>
  <div :class="rowClasses">
    <div :class="bubbleClasses">
      <p class="text-xs opacity-70 mb-1">{{ formattedTime }}</p>
      <p class="text-sm leading-relaxed">{{ message.text }}</p>

      <div
        v-if="isOwn && message.status"
        class="flex items-center justify-end mt-1 gap-1"
      >
        <div
          v-if="message.status === MessageStatus.PENDING"
          class="flex items-center gap-1"
        >
          <SpinnerIcon class="w-3 h-3 opacity-70" />
          <span class="text-xs opacity-70">Sending...</span>
        </div>

        <div
          v-else-if="message.status === MessageStatus.SENT"
          class="flex items-center"
        >
          <svg
            class="w-4 h-4 opacity-70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <button
          v-else-if="message.status === MessageStatus.FAILED"
          class="flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
          title="Click to retry"
          @click="handleRetry"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Retry</span>
        </button>
      </div>
    </div>
  </div>
</template>
