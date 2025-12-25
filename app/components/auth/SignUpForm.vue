<script lang="ts" setup>
import type z from 'zod';
import signupSchema from '~/schemas/auth/signup.schema';
import { toast } from 'vue-sonner';

type SignUpData = z.infer<typeof signupSchema>

const router = useRouter();

const onSubmit = async (values: SignUpData ) => {
    const formData = new FormData();
    
    Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });

    await apiFetch('/api/v1/auth/signup', {
        method: 'POST',
        body: formData,
        onSuccess: (_, message) => {
            toast.success(message);
            router.push('/');
        }
    });
}
</script>

<template>
    <CommonMainCard>
        <CommonFormMainForm :schema="signupSchema" @submit="onSubmit">
            <CommonFormFieldsTextField name="email" label="Email" type="email" placeholder="name@example.com" />
            <CommonFormFieldsTextField name="userName" label="User Name" placeholder="Enter your user name" />
            <CommonFormFieldsTextAreaField name="bio" label="Bio" placeholder="Enter your bio" />
            <CommonFormFieldsFileField name="profilePicture" label="Profile Picture" />
            <CommonFormFieldsPasswordField name="password" label="Password" placeholder="Enter your password" />
            <CommonFormFieldsPasswordField name="confirmPassword" label="Confirm Password" placeholder="Confirm your password" />
            <div class="mt-6">
                <MainButton type="submit">Create Account</MainButton>
            </div>
        </CommonFormMainForm>
    </CommonMainCard>
</template>

