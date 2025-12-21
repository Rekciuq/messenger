<script lang="ts" setup>
const {
    type = "button",
    classes = "",
    disabled = false
} = defineProps<{
    type?: "button" | "submit" | "reset";
    classes?: string;
    disabled?: boolean;
}>();

const baseClasses = "w-full bg-brand text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 transition-all shadow-brand disabled:opacity-50 disabled:cursor-not-allowed";
const mergedClasses = computed(() => cn(baseClasses, classes));
</script>

<template>
  <button :type="type" :class="mergedClasses" :disabled="disabled">
    <slot />
  </button>
</template>
