<script lang="ts" setup>
  import ChatView from "~/components/dashboard/ChatView.vue";
  import Sidebar from "~/components/dashboard/Sidebar.vue";
  import type { ApiResponse } from "~/types/api";
  import type { ChatViewResponse } from "~~/server/bll/ChatService";
  import Modal from "~/components/common/Modal.vue";
  import UserInfoForm from "~/components/userProfile/UserInfoForm.vue";

  definePageMeta({
    layout: "app",
  });

  const authStore = useAuthStore();
  const socketStore = useSocketStore();

  const userId = computed(() => authStore.session?.id);
  const userAdditionalData = computed(() => ({
    newUsername: authStore.session?.userName,
    newBio: authStore.session?.bio,
  }));

  watch(
    userId,
    (newUserId) => {
      if (!newUserId) {
        return;
      }

      socketStore.connect(newUserId);
    },
    { immediate: true },
  );

  const selectedChatId = ref<string | undefined>(undefined);

  const handleChatSelect = (chatId: string) => {
    selectedChatId.value = chatId;
  };

  const profileFormValues = ref<
    { newUsername: string; newBio: string; newProfilePicture: string } | object
  >({});

  const handleUserClick = () => {
    if (!selectedChatId.value) {
      profileFormValues.value = userAdditionalData.value;
      openModal();
    }
    selectedChatId.value = undefined;
  };

  const handleChatBack = () => {
    selectedChatId.value = undefined;
  };

  const { data: chats } = await useFetch<ApiResponse<ChatViewResponse>>(
    `/api/v1/chats/${userId.value}`,
  );
  const chatsData = chats.value?.data;

  const selectedChat = computed(() =>
    chatsData?.find((chatView) => chatView.id === selectedChatId.value),
  );

  const isModalOpenRef = ref(false);

  const openModal = () => (isModalOpenRef.value = true);

  const profileFormRef = ref<{
    submit: () => Promise<void>;
  } | null>(null);

  const submitCallback = async () => {
    await profileFormRef.value?.submit();
  };

  const isUserFormSubmitting = ref(false);
  const isUserFormReadOnly = computed(() => selectedChatId.value);
  const userChatAdditionalInfo = computed(() => ({
    newUsername: selectedChat.value?.participant.userName,
    newBio: selectedChat.value?.participant.bio,
    newProfilePicture: selectedChat.value?.participant.profilePicture,
  }));
</script>
<template>
  <div class="h-screen bg-app-bg flex flex-col md:flex-row overflow-hidden">
    <Modal
      :title="isUserFormReadOnly ? 'User Info' : 'User Edit Form'"
      :is-open="isModalOpenRef"
      :save-button="
        isUserFormReadOnly ? undefined : { callback: submitCallback }
      "
      :is-loading="isUserFormSubmitting"
      @close="isModalOpenRef = false"
    >
      <UserInfoForm
        ref="profileFormRef"
        :is-read-only="!!isUserFormReadOnly"
        :default-values="
          isUserFormReadOnly ? userChatAdditionalInfo : profileFormValues
        "
        :hide-submit-button="true"
        :after-submit-callback="async () => await authStore.fetchSession()"
        @start-loading="isUserFormSubmitting = true"
        @end-loading="isUserFormSubmitting = false"
      />
    </Modal>
    <Sidebar
      :chats="chatsData"
      :selected-chat-id="selectedChatId"
      @user-click="handleUserClick"
      @chat-select="handleChatSelect"
    />

    <div
      :class="[
        'flex-1 min-h-0 overflow-hidden',
        selectedChatId ? 'block' : 'hidden md:block',
        'p-4 md:p-6',
      ]"
    >
      <ChatView
        :chat="selectedChat"
        class="h-full"
        @back="handleChatBack"
        @open-user-info-modal="openModal"
      />
    </div>
  </div>
</template>
