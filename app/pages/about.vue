<script setup lang="ts">
const buttonCount = shallowRef(0);

const updater = async () => {
    buttonCount.value++;
    buttonCount.value++;
};
</script>

<template>
    <div>
        <MainIcon />
        <span>counter's count is {{ buttonCount }}</span>
        <button class="text-red-500" @click="updater">Click me</button>
    </div>
</template>
