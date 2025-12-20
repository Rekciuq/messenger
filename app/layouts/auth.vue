<script lang="ts" setup>
const route = useRoute();
const isLogin = route.fullPath.includes("login");
const authTitle = isLogin ? "Login": "Signup"
</script>

<template>
    <div>
        <main-icon />
        <h1>Welcome to the Messenger</h1>
        {{ authTitle }}
        <slot />
    </div>
</template>
