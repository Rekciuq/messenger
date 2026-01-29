import { useVirtualizer } from "@tanstack/vue-virtual";
import type { Ref, ComputedRef } from "vue";
import type { MessageView } from "~~/server/bll/MessageService";
import type { ChatMessage } from "~/types/chat";

type MessageUnion = MessageView | ChatMessage;

interface UseChatVirtualizerOptions {
  messages: ComputedRef<MessageUnion[]>;
  scrollParentRef: Ref<HTMLElement | null>;
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: Ref<boolean>;
  isFetchingNextPage: Ref<boolean>;
  messagesDataPagesLength: ComputedRef<number | undefined>;
}

export function useChatVirtualizer({
  messages,
  scrollParentRef,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  messagesDataPagesLength,
}: UseChatVirtualizerOptions) {
  const virtualizer = useVirtualizer(
    computed(() => ({
      count: messages.value.length,
      getScrollElement: () => scrollParentRef.value,
      estimateSize: () => 72,
      overscan: 50,
      getItemKey: (index: number): string | number => {
        const msg = messages.value[index];
        if (!msg) return index;
        if ("tempId" in msg && msg.tempId) {
          return msg.tempId;
        }
        return msg.id;
      },
    })),
  );

  const scrollToBottom = () => {
    if (scrollParentRef.value) {
      scrollParentRef.value.scrollTop = scrollParentRef.value.scrollHeight;
    }
  };

  const isLoadingPrevious = ref(false);
  const scrollHeightBeforeLoad = ref(0);
  const scrollTopBeforeLoad = ref(0);

  watchEffect(() => {
    const virtualItems = virtualizer.value.getVirtualItems();

    if (
      !virtualItems.length ||
      !hasNextPage.value ||
      isFetchingNextPage.value ||
      isLoadingPrevious.value
    )
      return;

    const firstItem = virtualItems[0];

    if (firstItem && firstItem.index < 5) {
      isLoadingPrevious.value = true;

      if (scrollParentRef.value) {
        scrollHeightBeforeLoad.value = scrollParentRef.value.scrollHeight;
        scrollTopBeforeLoad.value = scrollParentRef.value.scrollTop;
      }

      fetchNextPage();
    }
  });

  watch(messagesDataPagesLength, async (newPageCount, oldPageCount) => {
    if (
      isLoadingPrevious.value &&
      newPageCount &&
      oldPageCount &&
      newPageCount > oldPageCount
    ) {
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (scrollParentRef.value && scrollHeightBeforeLoad.value) {
        const scrollHeightAfterLoad = scrollParentRef.value.scrollHeight;
        const heightDifference =
          scrollHeightAfterLoad - scrollHeightBeforeLoad.value;

        scrollParentRef.value.scrollTop =
          scrollTopBeforeLoad.value + heightDifference;
      }

      isLoadingPrevious.value = false;
    }
  });

  const hasScrolledToInitialBottom = ref(false);

  watch(
    () => messages.value.length,
    (newLength, oldLength) => {
      if (newLength > 0 && oldLength === 0) {
        nextTick(() => {
          scrollToBottom();
          hasScrolledToInitialBottom.value = true;
        });
      } else if (
        newLength > 0 &&
        scrollParentRef.value &&
        scrollParentRef.value.scrollTop === 0 &&
        !hasScrolledToInitialBottom.value
      ) {
        nextTick(() => {
          scrollToBottom();
          hasScrolledToInitialBottom.value = true;
        });
      }
    },
    { flush: "post" },
  );

  watch(
    () => messages.value.length,
    (newLength) => {
      if (newLength === 0) {
        hasScrolledToInitialBottom.value = false;
      }
    },
  );

  return {
    virtualizer,
    scrollToBottom,
  };
}
