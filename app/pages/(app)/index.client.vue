<script lang="ts" setup>
import ChatView from "~/components/dashboard/ChatView.vue";
import Sidebar from "~/components/dashboard/Sidebar.vue";
import { socket } from "~/utils/socket";
import type { ApiResponse } from "~/types/api";
import type { ChatViewResponse } from "~~/server/bll/ChatService";
import Modal from "~/components/common/Modal.vue";
import UserInfoForm from "~/components/userProfile/UserInfoForm.vue";

definePageMeta({
    layout: "app",
});

const authStore = useAuthStore();

const userId = computed(() => authStore.session?.id)
const userAdditionalData = computed(() => ({newUsername: authStore.session?.userName, newBio: authStore.session?.bio}))

// onMounted(() => {
//     socket.connect();
//     socket.on('connect', () => {
//         authStore.updateOnlineStatus(true);
//         console.log('Connected to server');
//     });
//     socket.emit('room-join', { userId, chatId: userId });
//     socket.on('message', (message: string) => {
//         console.log('Received message:', message);
//     });
//     socket.on('disconnect', () => {
//         authStore.updateOnlineStatus(false);
//     });
// });

const selectedChatId = ref<string | undefined>(undefined);

watch(selectedChatId, (newVal, oldVal) => {
    if (oldVal && oldVal !== newVal) {
        socket.emit('room-leave', { userId, chatId: oldVal });
    }
    if (newVal) {
        socket.emit('room-join', { userId, chatId: newVal });
    }
});

const handleChatSelect = (chatId: string) => {
    selectedChatId.value = chatId;
};

const profileFormValues = ref<{newUsername: string; newBio: string; newProfilePicture: string} | object>({})

const handleUserClick = () => {
    if(!selectedChatId.value) {
    profileFormValues.value = userAdditionalData.value
        openModal()
    }
    selectedChatId.value = undefined;
};

const handleSendMessage = (message: string) => {
    console.log("Sending message to chat", selectedChatId.value, ":", message);
    socket.emit('message', { chatId: selectedChatId.value, message: message });
};

const handleChatBack = () => {
    selectedChatId.value = undefined;
};

const { data: chats } = await useFetch<ApiResponse<ChatViewResponse>>(`/api/v1/chats/${userId.value}`);
const chatsData = chats.value?.data 

const selectedChat = computed(() => chatsData?.find((chatView) => chatView.id === selectedChatId.value))

const isModalOpenRef = ref(false)

const openModal = () => 
    isModalOpenRef.value = true

const profileFormRef = ref<{
    submit: () => Promise<void>
} | null>(null)

const submitCallback = async () => { 
    await profileFormRef.value?.submit();
}

const isUserFormSubmitting = ref(false)
const isUserFormReadOnly = computed(() => selectedChatId.value)
const userChatAdditionalInfo = computed(() => ({newUsername: selectedChat.value?.participant.userName, newBio: selectedChat.value?.participant.bio, newProfilePicture: selectedChat.value?.participant.profilePicture}))
</script>
<template>
    <div class="min-h-screen bg-app-bg flex flex-col md:flex-row">
        <Modal :title="isUserFormReadOnly ? 'User Info' :'User Edit Form'" :is-open="isModalOpenRef" :save-button="isUserFormReadOnly ? undefined : {callback: submitCallback }" :is-loading="isUserFormSubmitting" @close="isModalOpenRef = false">
            <UserInfoForm ref="profileFormRef" :is-read-only="!!isUserFormReadOnly" :default-values="isUserFormReadOnly ? userChatAdditionalInfo : profileFormValues" :hide-submit-button="true" :after-submit-callback=" async () => await authStore.fetchSession()" @start-loading="isUserFormSubmitting = true" @end-loading="isUserFormSubmitting = false" />
        </Modal>
        <Sidebar
            :chats="chatsData"
            :selected-chat-id="selectedChatId"
            @user-click="handleUserClick"
            @chat-select="handleChatSelect"
        />

        <div
            :class="[
                'flex-1',
                selectedChatId ? 'block' : 'hidden md:block',
                'p-4 md:p-6'
            ]"
        >
            <ChatView
                :chat="selectedChat"
                class="h-full"
                @send-message="handleSendMessage"
                @back="handleChatBack"
                @open-user-info-modal="openModal"
            />
        </div>
    </div>
</template>
