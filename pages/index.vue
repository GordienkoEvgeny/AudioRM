<script setup lang="ts">
import UIRotatingButton from '~/components/ui/ui-button/UIRotatingButton.vue'

console.log('process.server:', process.server)

function handleClick() {
    console.log('Button clicked')
}
</script>

<template>
    <div class="index-page">
        <UIRotatingButton class="index-page__button" />
    </div>
</template>

<style scoped lang="postcss">
.index-page {
    position: relative;
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.index-page__button {
    position: relative;
    z-index: 2;
}
</style>