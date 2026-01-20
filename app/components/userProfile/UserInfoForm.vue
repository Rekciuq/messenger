<script lang="ts" setup>
import { toast } from 'vue-sonner';
import type z from 'zod';
import userProfileSchema from '~/schemas/userProfile.schema';

type UserProfileData = z.infer<typeof userProfileSchema>

const {
    hideSubmitButton = false,
    defaultValues,
    afterSubmitCallback = async () => undefined,
    isReadOnly = false
} = defineProps<{
    hideSubmitButton?: boolean
    defaultValues: UserProfileData | object
    afterSubmitCallback?: () => Promise<void>
    isReadOnly?: boolean;
}>()

const authStore = useAuthStore();

const userId = computed(() => authStore.session?.id)

const emit = defineEmits<{
    "start-loading": [],
    "end-loading": []
}>()

const onSubmit = async (values: UserProfileData ) => {
    const formData = new FormData();
    emit("start-loading")
    
    Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });

    try {
        await apiFetch(`/api/v1/user-profile/${userId.value}`, {
            method: 'PATCH',
            body: formData,
            onSuccess: (_, message) => {
                toast.success(message);
            }
        });
        await afterSubmitCallback?.()
    } catch(e) {
        if(e instanceof Error) {
            toast.error(e.message)
        }
    } finally {
        emit("end-loading")
    }
}

const formRef = ref<{
    onSubmit: () => Promise<void>
} | null>(null)

defineExpose({
    async submit() {await formRef.value?.onSubmit().then(() => console.log("Waited"))}
})
</script>

<template>
    <CommonFormMainForm ref="formRef" :initial-values="defaultValues" :schema="userProfileSchema" @submit="onSubmit">
        <CommonFormFieldsTextField :disabled="isReadOnly" name="newUsername" label="User Name" placeholder="Enter your user name" />
        <CommonFormFieldsTextAreaField :disabled="isReadOnly" name="newBio" label="Bio" placeholder="Enter your bio" />
        <CommonFormFieldsFileField v-if="!isReadOnly" name="newProfilePicture" label="Profile Picture" />
        <div :class="hideSubmitButton ? 'hidden': ''">
            <MainButton type="submit"/>
        </div>
    </CommonFormMainForm>
</template>