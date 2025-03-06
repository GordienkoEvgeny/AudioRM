import { promises as fs } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
    try {
        const audioDir = resolve(process.cwd(), 'public/audio')
        const files = await fs.readdir(audioDir)
        
        // Фильтруем только аудио файлы
        const audioFiles = files.filter(file => 
            file.endsWith('.mp3') || 
            file.endsWith('.wav') || 
            file.endsWith('.ogg')
        )
        
        // Формируем список треков
        const tracks = audioFiles.map((file, index) => ({
            id: (index + 1).toString(),
            title: file.split('.')[0].replace(/_/g, ' '), // Заменяем подчеркивания на пробелы
            artist: 'Unknown', // Можно будет улучшить определение артиста
            duration: 0, // Длительность будет определяться на клиенте
            melody: [],
            audio: `/audio/${file}`
        }))
        
        return {
            tracks
        }
    } catch (error) {
        console.error('Ошибка при получении списка треков:', error)
        throw createError({
            statusCode: 500,
            message: 'Ошибка при получении списка треков'
        })
    }
}) 