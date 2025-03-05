<template>
    <div class="layout-default">
        <p class="text-white">Default layout</p>
        <slot />
    </div>
</template>

<style scoped lang="postcss">
.layout-default {
    background-color: rgb(0, 0, 0);
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.text-white {
    color: white;
}
</style>