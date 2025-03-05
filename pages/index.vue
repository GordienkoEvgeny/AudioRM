<script setup lang="ts">
import UIButton from '~/components/ui/ui-button/UIButton.vue'

console.log('process.server:', process.server)

function handleClick() {
    console.log('Button clicked')
}
</script>

<template>
    <div class="index-page">
        <UIButton class="index-page__button" @click="handleClick">Click me</UIButton>
    </div>
</template>

<style scoped lang="postcss">

.index-page {
    background-color: rgb(255, 255, 255);
}

.index-page__button {
    background-color: rgb(142, 139, 139);
    color: rgb(255, 255, 255);
}
</style>