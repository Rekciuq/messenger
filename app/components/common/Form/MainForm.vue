<script lang="ts" setup generic="T extends z.ZodType">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod"
import type z from "zod";

const { schema, classes = "" } = defineProps<{ schema: T; classes?: string }>();
const { handleSubmit } = useForm({ validationSchema: toTypedSchema(schema) });

const emit = defineEmits<{
    (e: "submit", values: z.infer<T>): void
}>()

const onSubmit = handleSubmit((values) => emit("submit", values))

const baseClasses = "w-full"
const mergedClasses = computed(() =>cn(baseClasses, classes))
</script>

<template>
    <form :class="mergedClasses" @submit="onSubmit">
        <slot />
    </form>
</template>
