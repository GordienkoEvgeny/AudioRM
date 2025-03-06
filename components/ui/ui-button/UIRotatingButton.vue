<template>
    <button class="rotating-button" :class="{ 'is-rotating': isRotating }" @click="toggleRotation">
        <img ref="imageRef" src="/public/images/music-disc.png" alt="Play button" class="rotating-button__image"
            :style="rotationStyle" />
    </button>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'

const isRotating = ref(false)
const currentRotation = ref(0)
const imageRef = ref<HTMLImageElement | null>(null)
let animationFrame: number | null = null
let lastTimestamp: number | null = null

const rotationStyle = computed(() => ({
    transform: `rotate(${currentRotation.value}deg)`
}))

function updateRotation(timestamp: number) {
    if (!lastTimestamp)
    {
        lastTimestamp = timestamp
    }

    const deltaTime = timestamp - lastTimestamp
    currentRotation.value += deltaTime / 30 // Скорость вращения
    lastTimestamp = timestamp

    if (isRotating.value)
    {
        animationFrame = requestAnimationFrame(updateRotation)
    }
}

function toggleRotation() {
    isRotating.value = !isRotating.value

    if (isRotating.value)
    {
        lastTimestamp = null
        animationFrame = requestAnimationFrame(updateRotation)
    } else if (animationFrame)
    {
        cancelAnimationFrame(animationFrame)
    }
}

// Очистка при размонтировании компонента
onBeforeUnmount(() => {
    if (animationFrame)
    {
        cancelAnimationFrame(animationFrame)
    }
})
</script>

<style scoped lang="postcss">
.rotating-button {
    background: rgba(255, 255, 255, 0.03);
    border: none;
    padding: 0;
    cursor: pointer;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
    backdrop-filter: blur(5px);

    &:hover {
        transform: scale(1.1);
    }
}

.rotating-button__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.1s linear;
}

.is-rotating {
    box-shadow: 0 0 20px rgba(245, 185, 6, 0.2);
}
</style>