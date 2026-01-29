import { useInfiniteQuery } from "@tanstack/vue-query";
import type { ComputedRef } from "vue";
import type { ApiResponse } from "~/types/api";
import type { MessageView } from "~~/server/bll/MessageService";
import type { Pagination } from "~/types/pagination";

const MESSAGES_PER_PAGE = 50;

export const useMessagesInfiniteQuery = (chatId: ComputedRef<string>) => {
  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: computed(() => ["messages", chatId.value]),
    queryFn: async ({ pageParam = 1 }) => {
      if (!chatId.value)
        return {
          messages: [],
          pagination: { page: 1, limit: MESSAGES_PER_PAGE },
        };

      const response = await $fetch<
        ApiResponse<{
          messages: MessageView[];
          pagination: Pagination;
        }>
      >(`/api/v1/messages/${chatId.value}`, {
        query: {
          page: pageParam,
          limit: MESSAGES_PER_PAGE,
        },
      });

      return response.data!;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (
        !lastPage.messages.length ||
        lastPage.messages.length < MESSAGES_PER_PAGE
      ) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: computed(() => !!chatId.value),
  });

  const allMessages = computed(() => {
    if (!messagesData.value) return [];
    const reversedPages = [...messagesData.value.pages].reverse();
    return reversedPages.flatMap((page) => page.messages);
  });

  const messageAt = (index: number) => allMessages.value[index];

  const isInitialLoading = computed(
    () => isLoading.value && !messagesData.value,
  );

  const isReady = ref(false);

  watch(
    () => messagesData.value?.pages,
    async (pages) => {
      if (pages && pages.length > 0) {
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 100));
        isReady.value = true;
      } else {
        isReady.value = false;
      }
    },
    { immediate: true, deep: true },
  );

  const chatIdString = computed(() => chatId.value);
  watch(chatIdString, () => {
    isReady.value = false;
  });

  return {
    messagesData,
    allMessages,
    messageAt,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isInitialLoading,
    isReady,
  };
};
