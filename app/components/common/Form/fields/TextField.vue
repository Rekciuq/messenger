<script lang="ts" setup>
import { useField } from "vee-validate";

const { name, label } = defineProps<{ name: string, label: string }>();
const { errors, value } = useField<string | number>(() => name);
const hasErrors = !!errors.value.length;
</script>

<template>
    <div>
        <CommonFormMainLabel :name="name" :label="label" :has-error="hasErrors" />
        <CommonFormMainInput v-model="value" :name="name" type="text" />
        <CommonFormMainErrorMessage :error-messages="errors" />
    </div>
</template>
