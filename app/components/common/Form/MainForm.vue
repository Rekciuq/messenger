<script lang="ts" setup generic="T extends z.ZodType">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod"
import type z from "zod";

const { schema, classes = "", initialValues = undefined } = defineProps<{ schema: T; classes?: string; initialValues?: z.infer<T>; }>();
const { handleSubmit } = useForm({ validationSchema: toTypedSchema(schema), initialValues });

const emit = defineEmits<{
    (e: "submit", values: z.infer<T>): void
}>()

const onSubmit = handleSubmit(async (values) => emit("submit", values))

const baseClasses = "w-full"
const mergedClasses = computed(() =>cn(baseClasses, classes))

defineExpose({async onSubmit() {
    await onSubmit().then(() => console.log("Waited in form"))
}})
</script>

<template>
    <form :class="mergedClasses" @submit="onSubmit">
        <slot />
    </form>
</template>
