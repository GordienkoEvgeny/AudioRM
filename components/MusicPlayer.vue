<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useMusicStore } from '~/stores/music'
import UIRotatingButton from '~/components/ui/ui-button/UIRotatingButton.vue'

interface Track {
    id: string;
    title: string;
    artist: string;
    duration: number;
    melody: any[];
    audio?: string;
}

const musicStore = useMusicStore()
const audioRef = ref<HTMLAudioElement | null>(null)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const isTrackListVisible = ref(false)

// Загрузка популярных треков при монтировании
onMounted(async () => {
    await musicStore.fetchTracks()
})

// Форматирование времени
const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Обработчики аудио событий
const onTimeUpdate = () => {
    if (!audioRef.value) return
    currentTime.value = audioRef.value.currentTime
    // Проверяем, что длительность корректна
    if (duration.value > 0) {
        progress.value = (currentTime.value / duration.value) * 100
    }
}

const onTrackLoad = () => {
    if (!audioRef.value) return
    // Устанавливаем длительность из метаданных
    duration.value = audioRef.value.duration
    console.log('Метаданные загружены, длительность:', duration.value)
}

const onLoadedData = () => {
    if (!audioRef.value) return
    // Дополнительная проверка длительности при загрузке данных
    if (audioRef.value.duration && audioRef.value.duration !== duration.value) {
        duration.value = audioRef.value.duration
        console.log('Данные загружены, обновлена длительность:', duration.value)
    }
}

const onTrackEnd = () => {
    if (musicStore.hasNextTrack) {
        playNext()
    } else {
        musicStore.togglePlayback()
    }
}

// Добавляем новые обработчики
const onAudioError = (e: Event) => {
    console.error('Ошибка аудио:', e)
    const audio = e.target as HTMLAudioElement
    console.error('Ошибка загрузки аудио:', audio.error)
    musicStore.setError(`Ошибка загрузки аудио: ${audio.error?.message || 'неизвестная ошибка'}`)
    musicStore.togglePlayback()
}

const onCanPlay = () => {
    console.log('Аудио готово к воспроизведению')
    console.log('Текущий источник:', audioRef.value?.src)
}

const togglePlay = async () => {
    if (!audioRef.value || !musicStore.currentTrack) {
        console.error('Аудио элемент или текущий трек не найден')
        return
    }
    
    if (!musicStore.currentTrack.audio) {
        console.error('URL аудио не указан')
        musicStore.setError('URL аудио не указан')
        return
    }
    
    try {
        if (!musicStore.isPlaying) {
            // Загружаем аудио только если это новый трек
            if (!audioRef.value.currentTime) {
                await audioRef.value.load()
                // Ждем, пока аудио будет готово к воспроизведению
                if (audioRef.value.readyState < 2) { // HAVE_CURRENT_DATA = 2
                    await new Promise((resolve) => {
                        audioRef.value!.addEventListener('canplay', resolve, { once: true })
                    })
                }
            }
            musicStore.togglePlayback()
            await audioRef.value.play()
        } else {
            audioRef.value.pause()
            musicStore.togglePlayback()
        }
    } catch (error) {
        console.error('Ошибка воспроизведения:', error)
        musicStore.setError(`Ошибка воспроизведения: ${error}`)
        musicStore.togglePlayback()
    }
}

// Модифицируем playTrack
const playTrack = async (track: Track) => {
    console.log('Воспроизведение трека:', track)
    
    if (musicStore.isPlaying) {
        audioRef.value?.pause()
    }
    
    musicStore.setCurrentTrack(track)
    
    // Ждем обновления DOM и загрузки аудио
    await nextTick()
    
    if (audioRef.value) {
        try {
            await audioRef.value.load() // Принудительно перезагружаем аудио
            
            // Ждем, пока аудио будет готово к воспроизведению
            if (audioRef.value.readyState < 2) { // HAVE_CURRENT_DATA = 2
                await new Promise((resolve) => {
                    audioRef.value!.addEventListener('canplay', resolve, { once: true })
                })
            }
            
            if (!musicStore.isPlaying) {
                musicStore.togglePlayback()
            }
            await audioRef.value.play()
        } catch (error) {
            console.error('Ошибка воспроизведения:', error)
            musicStore.setError('Ошибка воспроизведения аудио')
            if (musicStore.isPlaying) {
                musicStore.togglePlayback()
            }
        }
    }
}

const playNext = () => {
    if (!musicStore.currentTrack || !musicStore.hasNextTrack) return
    
    const currentIndex = musicStore.tracks.findIndex(t => t.id === musicStore.currentTrack?.id)
    const nextTrack = musicStore.tracks[currentIndex + 1]
    
    if (nextTrack) {
        playTrack(nextTrack)
    }
}

const playPrevious = () => {
    if (!musicStore.currentTrack || !musicStore.hasPreviousTrack) return
    
    const currentIndex = musicStore.tracks.findIndex(t => t.id === musicStore.currentTrack?.id)
    const previousTrack = musicStore.tracks[currentIndex - 1]
    
    if (previousTrack) {
        playTrack(previousTrack)
    }
}

// Перемотка
const seek = (event: MouseEvent) => {
    if (!audioRef.value || duration.value <= 0) {
        console.error('Аудио не готово для перемотки:', {
            audioRef: !!audioRef.value,
            duration: duration.value
        })
        return
    }
    
    const progressBar = event.currentTarget as HTMLElement
    const rect = progressBar.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const percent = Math.max(0, Math.min(1, clickX / rect.width))
    const newTime = percent * duration.value
    
    console.log('Перемотка:', {
        percent,
        newTime,
        duration: duration.value
    })
    
    try {
        audioRef.value.currentTime = newTime
        currentTime.value = newTime
        progress.value = percent * 100
    } catch (error) {
        console.error('Ошибка перемотки:', error)
    }
}

// Очистка при размонтировании
onBeforeUnmount(() => {
    if (audioRef.value) {
        audioRef.value.pause()
    }
})

// Автоматическая пауза при изменении трека
watch(() => musicStore.currentTrack, async () => {
    if (!audioRef.value) return
    
    audioRef.value.pause()
    currentTime.value = 0
    progress.value = 0
    
    // Сбрасываем длительность при смене трека
    duration.value = 0
    
    // Даем время на обновление src
    await nextTick()
    
    // Принудительно загружаем метаданные
    try {
        await audioRef.value.load()
    } catch (error) {
        console.error('Ошибка загрузки трека:', error)
    }
}, { immediate: true })

const toggleTrackList = () => {
    isTrackListVisible.value = !isTrackListVisible.value
}
</script>

<template>
    <div class="music-player">
        <!-- Текущий трек -->
        <div v-if="musicStore.currentTrack" class="music-player__current">
            <!-- <img 
                :src="musicStore.currentTrack.image" 
                :alt="musicStore.currentTrack.name"
                class="music-player__cover"
            /> -->
            <div class="music-player__info">
                <h3 class="music-player__title">{{ musicStore.currentTrack.audio?.split('/').pop()?.split('_')[1]?.replace('.mp3', '') }}</h3>
                <p class="music-player__artist">{{ musicStore.currentTrack.audio?.split('/').pop()?.split('_')[0] }}</p>
            </div>
        </div>

        <!-- Аудио контроллер -->
        <audio
            ref="audioRef"
            :src="musicStore.currentTrack?.audio"
            @timeupdate="onTimeUpdate"
            @ended="onTrackEnd"
            @loadedmetadata="onTrackLoad"
            @loadeddata="onLoadedData"
            @error="onAudioError"
            @canplay="onCanPlay"
            preload="metadata"
        />

        <!-- Контролы -->
        <div class="music-player__controls">
            <button 
                class="music-player__button"
                :disabled="!musicStore.hasPreviousTrack"
                @click="playPrevious"
            >
                ⏮
            </button>

            <UIRotatingButton
                :is-rotating="musicStore.isPlaying"
                @click="togglePlay"
            />

            <button 
                class="music-player__button"
                :disabled="!musicStore.hasNextTrack"
                @click="playNext"
            >
                ⏭
            </button>
        </div>

        <!-- Прогресс -->
        <div class="music-player__progress">
            <div class="music-player__progress-time">{{ formatTime(currentTime) }}</div>
            <div 
                class="music-player__progress-bar"
                @click="seek"
                :class="{ 'is-disabled': !duration }"
            >
                <div 
                    class="music-player__progress-current"
                    :style="{ width: `${progress}%` }"
                />
            </div>
            <div class="music-player__progress-time">{{ formatTime(duration) }}</div>
        </div>

        <!-- Кнопка для отображения списка -->
        <button 
            class="music-player__toggle-list"
            @click="toggleTrackList"
        >
            {{ isTrackListVisible ? 'Скрыть список треков' : 'Показать список треков' }}
        </button>

        <!-- Список треков -->
        <div 
            v-show="isTrackListVisible"
            class="music-player__tracks"
            :class="{ 'is-visible': isTrackListVisible }"
            v-if="musicStore.tracks.length > 0"
        >
            <div 
                v-for="track in musicStore.tracks" 
                :key="track.id"
                class="music-player__track"
                :class="{ 'is-active': musicStore.currentTrack?.id === track.id }"
                @click="playTrack(track)"
            >
                <div class="music-player__track-info">
                    <span class="music-player__track-name">{{ track.audio?.split('/').pop()?.split('_')[1]?.replace('.mp3', '') }}</span>
                    <span class="music-player__track-artist">{{ track.audio?.split('/').pop()?.split('_')[0] }}</span>
                </div>
            </div>
        </div>
        <div v-else-if="musicStore.isLoading" class="music-player__loading">
            Загрузка треков...
        </div>
        <div v-else class="music-player__empty">
            Нет доступных треков
        </div>
    </div>
</template>

<style scoped lang="postcss">
.music-player {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 20px;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}

.music-player__current {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
}

.music-player__cover {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
}

.music-player__info {
    flex: 1;
    text-align: center;
}

.music-player__title {
    font-size: 1.5rem;
    margin: 0;
    color: white;
}

.music-player__artist {
    font-size: 1rem;
    margin: 5px 0 0;
    color: rgba(255, 255, 255, 0.7);
}

.music-player__controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin: 20px 0;
}

.music-player__button {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 10px;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.music-player__progress {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 20px 0;
}

.music-player__progress-time {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    min-width: 45px;
}

.music-player__progress-bar {
    flex: 1;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
    
    &:hover:not(.is-disabled) {
        height: 10px;
        background: rgba(255, 255, 255, 0.15);
    }
    
    &.is-disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
}

.music-player__progress-current {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: white;
    border-radius: 4px;
    transition: width 0.1s linear;
}

.music-player__toggle-list {
    width: 100%;
    background: none;
    border: none;
    color: white;
    padding: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
    margin-top: 20px;
    
    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
}

.music-player__toggle-arrow {
    transition: transform 0.3s ease;
    
    &.is-rotated {
        transform: rotate(180deg);
    }
}

.music-player__tracks {
    margin-top: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease;
    opacity: 0;
    
    &.is-visible {
        max-height: 500px;
        opacity: 1;
        margin-top: 20px;
        padding-top: 20px;
    }
}

.music-player__track {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 8px;
    margin-bottom: 5px;
    
    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    &.is-active {
        background: rgba(255, 255, 255, 0.15);
    }
}

.music-player__track-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.music-player__track-name {
    color: white;
    font-size: 1rem;
}

.music-player__track-artist {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
}

.music-player__loading,
.music-player__empty {
    text-align: center;
    padding: 20px;
    color: rgba(255, 255, 255, 0.7);
    font-style: italic;
}
</style> 