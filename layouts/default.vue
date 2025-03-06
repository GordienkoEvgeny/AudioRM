<script setup lang="ts">
import Header from '@/widgets/Header.vue'
import Footer from '@/widgets/Footer.vue'
</script>
<template>
    <div class="layout-default">
        <div class="container">
            <!-- <Header /> -->
            <slot />
            <!-- <Footer /> -->
        </div>
    </div>
</template>

<style scoped lang="postcss">
.layout-default {
    background-image: url('/public/images/bacground2.jpg');
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.container {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 1200px;
    margin: 0 auto;
}

</style>