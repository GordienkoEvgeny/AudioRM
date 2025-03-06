// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ['~/assets/css/global.pcss'],
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    ssr: true,
    modules: [
        '@pinia/nuxt',
    ]
})
