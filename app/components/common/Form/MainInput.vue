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
    hasError = false
} = defineProps<{
    name: string;
    type: InputTypeHTMLAttribute;
    classes?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    autocomplete?: string;
    hasError?: boolean;
}>();

// TODO: add base styling
const baseClasses = "";
// TODO: add border styling on error
const mergedClasses = computed(() =>cn(baseClasses, hasError ? "" : "", classes));
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
    >
</template>
