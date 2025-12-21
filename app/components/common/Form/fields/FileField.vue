<script lang="ts" setup>
import { useField } from "vee-validate";
import { cn } from "~/utils/cn";

const { 
    name, 
    label, 
    placeholder = "Choose the file..."
} = defineProps<{ 
    name: string; 
    label: string;
    placeholder?: string;
}>();

const { errors, value, handleChange } = useField<File | null>(() => name);
const hasErrors = computed(() => !!errors.value.length);

const fileName = computed(() => value.value?.name || "");

const fileInputRef = ref<{ $el?: HTMLInputElement } | null>(null);

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        handleChange(file);
    }
};

const removeFile = () => {
    handleChange(null);
    if (fileInputRef.value?.$el) {
        (fileInputRef.value.$el as HTMLInputElement).value = "";
    }
};
</script>

<template>
    <div class="mb-6">
        <CommonFormMainLabel :name="name" :label="label" :has-error="hasErrors" />
        <div class="relative">
            <label
                :class="cn(
                    'border-2 w-full px-4 py-3 rounded-xl border-gray-200 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 outline-none transition-all text-left cursor-pointer pr-12 block',
                    hasErrors ? 'border-accent focus-within:border-accent focus-within:ring-accent/25' : '',
                    fileName ? 'text-text-primary' : 'text-text-secondary'
                )"
            >
                <CommonFormMainInput 
                    :id="name"
                    ref="fileInputRef"
                    :name="name" 
                    type="file"
                    :has-error="hasErrors"
                    classes="hidden"
                    @change="handleFileSelect"
                />
                <span class="truncate block">{{ fileName || placeholder }}</span>
            </label>
            <button
                v-if="fileName"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1 rounded"
                @click.stop="removeFile"
            >
                <CommonFormFieldsCrossIcon />
            </button>
        </div>
        <CommonFormMainErrorMessage :error-messages="errors" />
    </div>
</template>

