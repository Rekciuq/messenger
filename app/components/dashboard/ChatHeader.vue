<script lang="ts" setup>
import UserProfile from "~/components/dashboard/UserProfile.vue";
import BackArrowIcon from "~/components/common/icons/BackArrowIcon.vue";
import type { ParticipantView } from "~~/server/bll/ChatService";

const {
    classes = "",
    participant
} = defineProps<{
    classes?: string;
    participant: ParticipantView
}>();

const emit = defineEmits<{
    "back": [];
    "open-user-info-modal": []
}>();

const baseClasses = "flex items-center gap-3 p-4 border-b border-gray-200 bg-white";
const mergedClasses = computed(() => cn(baseClasses, classes));

const socketStore = useSocketStore()
const user = computed(() =>({email: participant.email, profilePicture: participant.profilePicture, lastSeen: participant.lastSeen.toLocaleString(), isOnline: !!socketStore.getOnlineUsers.find((id) => id === participant.userId)}))

</script>

<template>
    <div :class="mergedClasses">
        <button
            type="button"
            class="md:hidden shrink-0 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            @click="emit('back')"
        >
            <BackArrowIcon
                :size="5"
                class="text-text-primary"
            />
        </button>
        <UserProfile
            :user="user"
            :classes="'shrink-0 p-0 rounded-none shadow-none hover:shadow-none gap-3'"
            :show-status="true"
            @click="emit('open-user-info-modal')"
        />
    </div>
</template>
