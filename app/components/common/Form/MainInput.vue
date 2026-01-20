<script lang="ts" setup>
import type { InputTypeHTMLAttribute } from "vue";


const modelValue = defineModel<unknown>()
const {
    name,
    type,
    classes = "",
    placeholder = "",
    min = 0,
    max = 0,
    autocomplete = "",
    hasError = false,
    disabled = false
} = defineProps<{
    name: string;
    type: InputTypeHTMLAttribute;
    classes?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    autocomplete?: string;
    hasError?: boolean;
    disabled?: boolean;
}>();

const baseClasses = "border border-2 w-full px-4 py-3 rounded-xl border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all";
const mergedClasses = computed(() =>cn(baseClasses, hasError ? "border-accent focus:border-accent focus:ring-accent/25" : "", classes));
</script>

<template>
    <input
        v-model="modelValue"
        :name="name"
        :type="type"
        :class="mergedClasses"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :autocomplete="autocomplete"
        :disabled="disabled"
    >
</template>
