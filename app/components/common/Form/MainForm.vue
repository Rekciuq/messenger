<script lang="ts" setup generic="T extends z.ZodType">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod"
import type z from "zod";

const { schema } = defineProps<{ schema: T }>();
const { handleSubmit } = useForm({ validationSchema: toTypedSchema(schema) });

const emit = defineEmits<{
    (e: "submit", values: z.infer<T>): void
}>()

const onSubmit = handleSubmit((values) => emit("submit", values))
</script>

<template>
    <form @submit="onSubmit">
        <slot />
    </form>
</template>
