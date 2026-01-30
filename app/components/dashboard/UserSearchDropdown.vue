<script lang="ts" setup>
  import UserAvatar from "~/components/dashboard/UserAvatar.vue";
  import type { User } from "@prisma/client";
  import { useQuery } from "@tanstack/vue-query";

  const emit = defineEmits<{
    select: [userId: string];
  }>();

  const { value: searchQuery, debouncedValue: debouncedSearchQuery } =
    useDebouncedRef("", 500);

  const { data: searchResults, isFetching } = useQuery({
    queryKey: ["users-search", debouncedSearchQuery],
    queryFn: async () => {
      if (
        !debouncedSearchQuery.value ||
        debouncedSearchQuery.value.length < 2
      ) {
        return [];
      }

      const response = await $fetch<{
        success: boolean;
        data: (User & { profilePicture: { url: string } })[];
      }>(
        `/api/v1/users/search?q=${encodeURIComponent(debouncedSearchQuery.value)}`,
      );

      return response.data;
    },
    enabled: computed(() => debouncedSearchQuery.value.length >= 2),
  });

  const isManuallyOpen = ref(true);

  const isDropdownOpen = computed(
    () =>
      isManuallyOpen.value &&
      debouncedSearchQuery.value.length >= 2 &&
      (isFetching.value ||
        (searchResults.value && searchResults.value.length > 0)),
  );

  const closeDropdown = () => {
    searchQuery.value = "";
    isManuallyOpen.value = false;
  };

  const handleSelectUser = (userId: string) => {
    emit("select", userId);
    closeDropdown();
  };

  const dropdownRef = ref<HTMLElement | null>(null);

  onMounted(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.value &&
        !dropdownRef.value.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    onBeforeUnmount(() => {
      document.removeEventListener("mousedown", handleClickOutside);
    });
  });

  watch(searchQuery, (newValue) => {
    if (newValue.length > 0) {
      isManuallyOpen.value = true;
    }
  });
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search users to start a chat..."
        class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
      />
      <div
        v-if="isFetching"
        class="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        <SpinnerIcon :size="5" class="text-brand" />
      </div>
    </div>

    <div
      v-if="isDropdownOpen"
      class="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto"
    >
      <div v-if="isFetching && !searchResults?.length" class="p-4 text-center">
        <p class="text-sm text-text-secondary">Searching...</p>
      </div>

      <div v-else-if="searchResults && searchResults.length > 0" class="py-2">
        <button
          v-for="user in searchResults"
          :key="user.id"
          class="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
          @click="handleSelectUser(user.id)"
        >
          <UserAvatar
            :image-url="user.profilePicture.url"
            :alt="user.userName"
          />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-text-primary truncate">
              {{ user.userName }}
            </p>
            <p class="text-sm text-text-secondary truncate">{{ user.email }}</p>
          </div>
        </button>
      </div>

      <div
        v-else-if="!isFetching && debouncedSearchQuery.length >= 2"
        class="p-4 text-center"
      >
        <p class="text-sm text-text-secondary">No users found</p>
      </div>
    </div>
  </div>
</template>
