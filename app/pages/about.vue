<script setup lang="ts">
const buttonCount = ref(0);
</script>

<template>
    <div>
        <span>counter's count is {{ buttonCount }}</span>
        <button class="text-red-500" @click="buttonCount++">Click me</button>
    </div>
</template>
