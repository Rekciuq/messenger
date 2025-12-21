<script lang="ts" setup>
import type z from 'zod';
import loginSchema from '~/schemas/auth/login.schema';

type LoginData = z.infer<typeof loginSchema>

const onSubmit = (values: LoginData ) => console.log(values)
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