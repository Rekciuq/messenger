<script lang="ts" setup>
import type z from 'zod';
import loginSchema from '~/schemas/auth/login.schema';
import { toast } from 'vue-sonner';

type LoginData = z.infer<typeof loginSchema>

const router = useRouter();

const onSubmit = async (values: LoginData ) => {
    await apiFetch('/api/v1/auth/login', {
        method: 'POST',
        body: values,
        onSuccess: (_, message) => {
            toast.success(message);
            router.push('/');
        }
    });
}
</script>

<template>
    <CommonMainCard>
        <CommonFormMainForm :schema="loginSchema" @submit="onSubmit">
            <CommonFormFieldsTextField name="email" label="Email" type="email" placeholder="name@example.com" />
            <CommonFormFieldsPasswordField name="password" label="Password" placeholder="Enter your password" />
            <div class="mt-6">
                <MainButton type="submit">Sign In</MainButton>
            </div>
        </CommonFormMainForm>
    </CommonMainCard>
</template>