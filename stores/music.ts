import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Track {
    id: string
    title: string
    artist: string
    duration: number
    melody: any[]
    audio?: string
}

export const useMusicStore = defineStore('music', () => {
    const currentTrack = ref<Track | null>(null)
    const tracks = ref<Track[]>([])
    const isPlaying = ref(false)
    const error = ref<string | null>(null)
    const isLoading = ref(false)

    const hasPreviousTrack = computed(() => {
        if (!currentTrack.value || tracks.value.length === 0) return false
        const currentIndex = tracks.value.findIndex(t => t.id === currentTrack.value?.id)
        return currentIndex > 0
    })

    const hasNextTrack = computed(() => {
        if (!currentTrack.value || tracks.value.length === 0) return false
        const currentIndex = tracks.value.findIndex(t => t.id === currentTrack.value?.id)
        return currentIndex < tracks.value.length - 1
    })

    const fetchTracks = async () => {
        try {
            isLoading.value = true
            error.value = null
            
            const response = await fetch('/api/music/tracks')
            if (!response.ok) {
                throw new Error('Ошибка при получении треков')
            }
            
            const data = await response.json()
            tracks.value = data.tracks
            
            // Устанавливаем первый трек как текущий, если нет текущего
            if (!currentTrack.value && tracks.value.length > 0) {
                currentTrack.value = tracks.value[0]
            }
        } catch (err) {
            console.error('Ошибка при загрузке треков:', err)
            error.value = 'Ошибка при загрузке треков'
            tracks.value = []
        } finally {
            isLoading.value = false
        }
    }

    const setCurrentTrack = (track: Track) => {
        currentTrack.value = track
    }

    const addTrack = (track: Track) => {
        tracks.value.unshift(track)
    }

    const togglePlayback = () => {
        isPlaying.value = !isPlaying.value
    }

    const clearError = () => {
        error.value = null
    }

    const setError = (message: string) => {
        error.value = message
    }

    return {
        // Состояние
        currentTrack,
        tracks,
        isPlaying,
        error,
        isLoading,

        // Геттеры
        hasPreviousTrack,
        hasNextTrack,

        // Методы
        fetchTracks,
        setCurrentTrack,
        addTrack,
        togglePlayback,
        clearError,
        setError
    }
}) 