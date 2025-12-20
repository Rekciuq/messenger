<script lang="ts" setup>
import type z from 'zod';
import loginSchema from '~/schemas/auth/login.schema';

type LoginData = z.infer<typeof loginSchema>

const onSubmit = (values: LoginData ) => console.log(values)
</script>

<template>
    <CommonFormMainForm
:schema="loginSchema" @submit="(values) => {
    console.log(values)
        // make call to the backend
        // set some states
        // do other shit
    }" >
        <CommonFormFieldsTextField name="email" label="Email" />
        <CommonFormFieldsTextField name="password" label="Password" />
        <button>Button</button>
    </CommonFormMainForm>
</template>