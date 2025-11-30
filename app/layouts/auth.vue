<script lang="ts" setup>
const route = useRoute();
const isLogin = route.fullPath.includes("login");
console.log("isLogin", isLogin);
</script>
<template>
    <div>
        hey
        {{ isLogin }}
        <slot />
    </div>
</template>
