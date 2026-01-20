<script lang="ts" setup>
import { useField } from "vee-validate";

const { 
    name, 
    label, 
    placeholder = "",
    disabled = false
} = defineProps<{ 
    name: string; 
    label: string;
    placeholder?: string;
    disabled?: boolean;
}>();
const { errors, value } = useField<string | number>(() => name);
const hasErrors = computed(() =>!!errors.value.length);
</script>

<template>
    <div class="mb-6">
        <CommonFormMainLabel :name="name" :label="label" :has-error="hasErrors" />
        <CommonFormMainInput 
            v-model="value" 
            :name="name" 
            :placeholder="placeholder"
            :has-error="hasErrors" 
            type="text"
            :disabled="disabled"
        />
        <CommonFormMainErrorMessage :error-messages="errors" />
    </div>
</template>
