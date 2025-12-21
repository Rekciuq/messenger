<script lang="ts" setup>
import type z from 'zod';
import signupSchema from '~/schemas/auth/signup.schema';

type SignUpData = z.infer<typeof signupSchema>

const onSubmit = (values: SignUpData ) => console.log(values)
</script>

<template>
    <CommonMainCard>
        <CommonFormMainForm :schema="signupSchema" @submit="onSubmit">
            <CommonFormFieldsTextField name="email" label="Email" type="email" placeholder="name@example.com" />
            <CommonFormFieldsFileField name="profilePicture" label="Profile Picture" />
            <CommonFormFieldsPasswordField name="password" label="Password" placeholder="Enter your password" />
            <CommonFormFieldsPasswordField name="confirmPassword" label="Confirm Password" placeholder="Confirm your password" />
            <div class="mt-6">
                <MainButton type="submit">Create Account</MainButton>
            </div>
        </CommonFormMainForm>
    </CommonMainCard>
</template>

