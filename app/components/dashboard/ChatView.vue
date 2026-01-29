<script lang="ts" setup>
  import { cn } from "~/utils/cn";
  import ChatHeader from "~/components/dashboard/ChatHeader.vue";
  import ChatInputArea from "~/components/dashboard/ChatInputArea.vue";
  import ChatMessageBubble from "~/components/dashboard/ChatMessageBubble.vue";
  import SpinnerIcon from "~/components/common/icons/SpinnerIcon.vue";
  import type { ChatView } from "~~/server/bll/ChatService";
  import { MessageStatus, type ChatMessage } from "~/types/chat";
  import { useQueryClient } from "@tanstack/vue-query";
  import { socketService } from "~/utils/ClientSocketService";
  import type { MessageView } from "~~/server/bll/MessageService";

  type MessageUnion = MessageView | ChatMessage;

  interface MessagePage {
    messages: MessageUnion[];
    pagination: {
      page: number;
      limit: number;
    };
  }

  interface InfiniteQueryData {
    pages: MessagePage[];
    pageParams: unknown[];
  }

  const sortMessages = (messages: MessageUnion[]): MessageUnion[] => {
    return [...messages].sort((a, b) => {
      const dateA =
        typeof a.createdAt === "string"
          ? new Date(a.createdAt).getTime()
          : a.createdAt.getTime();
      const dateB =
        typeof b.createdAt === "string"
          ? new Date(b.createdAt).getTime()
          : b.createdAt.getTime();
      return dateA - dateB;
    });
  };

  const { classes = "", chat = null } = defineProps<{
    classes?: string;
    chat?: ChatView;
  }>();

  const emit = defineEmits<{
    "open-user-info-modal": [];
    back: [];
  }>();

  const chatId = computed(() => chat?.id ?? "");

  const {
    messagesData,
    allMessages,
    messageAt,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isInitialLoading,
    isReady,
  } = useMessagesInfiniteQuery(chatId);

  const showLoader = computed(() => isInitialLoading.value || !isReady.value);

  const scrollParentRef = ref<HTMLElement | null>(null);
  const messagesDataPagesLength = computed(
    () => messagesData.value?.pages.length,
  );

  const { virtualizer, scrollToBottom } = useChatVirtualizer({
    messages: allMessages,
    scrollParentRef,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    messagesDataPagesLength,
  });

  const messageText = ref("");
  const queryClient = useQueryClient();
  const authStore = useAuthStore();
  const userId = computed(() => authStore.session?.id);

  const handleSend = async () => {
    if (!messageText.value.trim() || !chatId.value || !userId.value) {
      return;
    }

    const text = messageText.value.trim();
    const tempId = crypto.randomUUID();

    const optimisticMessage: ChatMessage = {
      id: tempId,
      tempId,
      text,
      senderId: userId.value,
      chatId: chatId.value,
      createdAt: new Date().toISOString(),
      status: MessageStatus.PENDING,
    };

    messageText.value = "";

    const wasAtBottom = scrollParentRef.value
      ? Math.abs(
          scrollParentRef.value.scrollHeight -
            scrollParentRef.value.scrollTop -
            scrollParentRef.value.clientHeight,
        ) < 50
      : true;

    queryClient.setQueryData(
      ["messages", chatId.value],
      (old: InfiniteQueryData | undefined) => {
        if (!old || !old.pages || old.pages.length === 0) {
          return {
            pages: [
              {
                messages: [optimisticMessage],
                pagination: { page: 1, limit: 50 },
              },
            ],
            pageParams: [1],
          };
        }

        const newPages = old.pages.map((page, index) => {
          if (index === old.pages.length - 1) {
            const updatedMessages = sortMessages([
              ...page.messages,
              optimisticMessage,
            ]);
            return {
              ...page,
              messages: updatedMessages,
            };
          }
          return page;
        });

        return { ...old, pages: newPages };
      },
    );

    if (wasAtBottom) {
      nextTick(() => scrollToBottom());
    }

    try {
      const response = await socketService.sendMessage({
        toId: chatId.value,
        text,
      });

      if (response.success) {
        queryClient.setQueryData(
          ["messages", chatId.value],
          (old: InfiniteQueryData | undefined) => {
            if (!old) return old;

            const newPages = old.pages.map((page: MessagePage) => {
              const updatedMessages = page.messages.map(
                (msg: MessageUnion): MessageUnion =>
                  "tempId" in msg && msg.tempId === tempId
                    ? ({
                        ...response.message,
                        status: MessageStatus.SENT,
                      } as ChatMessage)
                    : msg,
              );
              return {
                ...page,
                messages: sortMessages(updatedMessages),
              };
            });

            return { ...old, pages: newPages };
          },
        );

        queryClient.invalidateQueries({ queryKey: ["chats"] });
      }
    } catch (error) {
      console.error("Failed to send message:", error);

      queryClient.setQueryData(
        ["messages", chatId.value],
        (old: InfiniteQueryData | undefined) => {
          if (!old) return old;

          const newPages = old.pages.map((page: MessagePage) => {
            const updatedMessages = page.messages.map(
              (msg: MessageUnion): MessageUnion =>
                "tempId" in msg && msg.tempId === tempId
                  ? ({ ...msg, status: MessageStatus.FAILED } as ChatMessage)
                  : msg,
            );
            return {
              ...page,
              messages: sortMessages(updatedMessages),
            };
          });

          return { ...old, pages: newPages };
        },
      );
    }
  };

  const handleRetryMessage = async (failedMessage: ChatMessage) => {
    if (!chatId.value || !failedMessage.tempId) {
      return;
    }

    queryClient.setQueryData(
      ["messages", chatId.value],
      (old: InfiniteQueryData | undefined) => {
        if (!old) return old;

        const newPages = old.pages.map((page: MessagePage) => {
          const updatedMessages = page.messages.map(
            (msg: MessageUnion): MessageUnion =>
              "tempId" in msg && msg.tempId === failedMessage.tempId
                ? ({ ...msg, status: MessageStatus.PENDING } as ChatMessage)
                : msg,
          );
          return {
            ...page,
            messages: sortMessages(updatedMessages),
          };
        });

        return { ...old, pages: newPages };
      },
    );

    try {
      const response = await socketService.sendMessage({
        toId: chatId.value,
        text: failedMessage.text,
      });

      if (response.success) {
        queryClient.setQueryData(
          ["messages", chatId.value],
          (old: InfiniteQueryData | undefined) => {
            if (!old) return old;

            const newPages = old.pages.map((page: MessagePage) => {
              const updatedMessages = page.messages.map(
                (msg: MessageUnion): MessageUnion =>
                  "tempId" in msg && msg.tempId === failedMessage.tempId
                    ? ({
                        ...response.message,
                        status: MessageStatus.SENT,
                      } as ChatMessage)
                    : msg,
              );
              return {
                ...page,
                messages: sortMessages(updatedMessages),
              };
            });

            return { ...old, pages: newPages };
          },
        );

        queryClient.invalidateQueries({ queryKey: ["chats"] });
      }
    } catch (error) {
      console.error("Failed to retry message:", error);

      queryClient.setQueryData(
        ["messages", chatId.value],
        (old: InfiniteQueryData | undefined) => {
          if (!old) return old;

          const newPages = old.pages.map((page: MessagePage) => {
            const updatedMessages = page.messages.map(
              (msg: MessageUnion): MessageUnion =>
                "tempId" in msg && msg.tempId === failedMessage.tempId
                  ? ({ ...msg, status: MessageStatus.FAILED } as ChatMessage)
                  : msg,
            );
            return {
              ...page,
              messages: sortMessages(updatedMessages),
            };
          });

          return { ...old, pages: newPages };
        },
      );
    }
  };

  defineExpose({
    scrollToBottom,
  });

  const baseClasses =
    "flex flex-col h-full min-h-0 bg-white rounded-2xl shadow-lg overflow-hidden";
  const mergedClasses = computed(() => cn(baseClasses, classes));
</script>

<template>
  <div v-if="chat" :class="mergedClasses">
    <ChatHeader
      :participant="chat.participant"
      @back="emit('back')"
      @open-user-info-modal="emit('open-user-info-modal')"
    />

    <div
      ref="scrollParentRef"
      class="flex-1 min-h-0 overflow-y-auto p-4 bg-app-bg"
    >
      <div v-if="showLoader" class="flex items-center justify-center h-full">
        <div class="flex flex-col items-center gap-3">
          <SpinnerIcon :size="8" class="text-brand" />
          <p class="text-sm text-text-secondary">Loading messages...</p>
        </div>
      </div>

      <div v-else-if="allMessages.length">
        <div
          class="relative w-full"
          :style="{ height: `${virtualizer.getTotalSize()}px` }"
        >
          <div
            v-if="isFetchingNextPage"
            class="absolute top-2 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div
              class="bg-brand text-white px-4 py-2 rounded-full text-sm shadow-brand"
            >
              Loading more messages...
            </div>
          </div>
          <div
            v-for="virtual in virtualizer.getVirtualItems()"
            :key="String(virtual.key)"
            class="absolute left-0 top-0 w-full"
            :style="{ transform: `translateY(${virtual.start}px)` }"
          >
            <div
              :ref="(el) => virtualizer.measureElement(el as Element)"
              :data-index="virtual.index"
              class="w-full py-2"
            >
              <ChatMessageBubble
                v-if="messageAt(virtual.index)"
                :message="messageAt(virtual.index)!"
                :is-own="userId === messageAt(virtual.index)?.senderId"
                @retry="handleRetryMessage"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex items-center justify-center h-full">
        <p class="text-sm text-text-secondary">
          No messages yet. Start the conversation!
        </p>
      </div>
    </div>

    <ChatInputArea v-model:message-text="messageText" @send="handleSend" />
  </div>
  <div
    v-else
    :class="
      cn(
        'flex items-center justify-center h-full bg-white rounded-2xl shadow-lg',
        classes,
      )
    "
  >
    <div class="text-center">
      <p class="text-sm text-text-secondary">
        Select a chat to start messaging
      </p>
    </div>
  </div>
</template>
