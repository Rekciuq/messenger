<script lang="ts" setup>
import { useField } from "vee-validate";
import { ref } from "vue";

const { 
    name, 
    label, 
    placeholder = ""
} = defineProps<{ 
    name: string; 
    label: string;
    placeholder?: string;
}>();

const { errors, value } = useField<string | number>(() => name);
const hasErrors = computed(() =>!!errors.value.length);

const showPassword = ref(false);
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};
</script>

<template>
    <div class="mb-6">
        <CommonFormMainLabel :name="name" :label="label" :has-error="hasErrors" />
        <div class="relative">
            <CommonFormMainInput 
                v-model="value" 
                :name="name" 
                :type="showPassword ? 'text' : 'password'"
                :placeholder="placeholder"
                :has-error="hasErrors"
                classes="pr-12"
            />
            <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1 rounded"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="togglePasswordVisibility"
            >
                <CommonFormFieldsEyeIcon v-if="showPassword" />
                <CommonFormFieldsEyeOffIcon v-else />
            </button>
        </div>
        <CommonFormMainErrorMessage :error-messages="errors" />
    </div>
</template>

