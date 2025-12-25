<script lang="ts" setup>
import { useField } from "vee-validate";
import { cn } from "~/utils/cn";

const { 
    name = undefined,
    label = undefined,
    placeholder = "",
    rows = 3,
    maxHeight = 120,
    autoResize = true,
    modelValue = undefined,
    hasError = false,
    errorMessages = []
} = defineProps<{ 
    name?: string;
    label?: string;
    placeholder?: string;
    rows?: number;
    maxHeight?: number;
    autoResize?: boolean;
    modelValue?: string;
    hasError?: boolean;
    errorMessages?: string[];
}>();

const emit = defineEmits<{
    "update:modelValue": [value: string];
    "keydown": [event: KeyboardEvent];
}>();

const isFormField = !!name;

let fieldValue: Ref<string>;
let fieldErrors: ComputedRef<string[]>;
let hasErrors: ComputedRef<boolean>;

if (isFormField) {
    const field = useField<string>(() => name!);
    fieldValue = field.value;
    fieldErrors = computed(() => field.errors.value);
    hasErrors = computed(() => !!fieldErrors.value.length);
} else {
    fieldValue = ref(modelValue || "");
    fieldErrors = computed(() => errorMessages);
    hasErrors = computed(() => hasError || fieldErrors.value.length > 0);
    
    watch(fieldValue, (newValue) => {
        emit("update:modelValue", newValue);
    });
    
    watch(() => modelValue, (newValue) => {
        if (newValue !== undefined && newValue !== fieldValue.value) {
            fieldValue.value = newValue;
        }
    });
}

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const baseClasses = "border border-2 w-full px-4 py-3 rounded-xl border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none text-sm text-text-primary placeholder:text-text-secondary";
const mergedClasses = computed(() => 
    cn(
        baseClasses, 
        hasErrors.value ? "border-accent focus:border-accent focus:ring-accent/25" : ""
    )
);

const adjustTextareaHeight = () => {
    if (autoResize && textareaRef.value) {
        textareaRef.value.style.height = "auto";
        textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, maxHeight)}px`;
    }
};

watch(fieldValue, () => {
    if (autoResize) {
        nextTick(() => adjustTextareaHeight());
    }
});

onMounted(() => {
    if (autoResize) {
        adjustTextareaHeight();
    }
});
</script>

<template>
    <div :class="isFormField ? 'mb-6' : ''">
        <CommonFormMainLabel v-if="label" :name="name || ''" :label="label" :has-error="hasErrors" />
        <textarea
            ref="textareaRef"
            v-model="fieldValue"
            :name="name"
            :placeholder="placeholder"
            :class="mergedClasses"
            :rows="rows"
            @input="adjustTextareaHeight"
            @keydown="(e) => emit('keydown', e)"
        />
        <CommonFormMainErrorMessage v-if="isFormField || (errorMessages && errorMessages.length > 0)" :error-messages="fieldErrors" />
    </div>
</template>
