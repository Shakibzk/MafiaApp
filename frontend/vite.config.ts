import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // همه‌ی مسیرهای OAuth و لاگین رو به بک‌اند بده
            '/oauth2': 'http://localhost:8080',
            '/login': 'http://localhost:8080',

            // اگه API جدا هم داری
            '/api': 'http://localhost:8080',
        },
        port: 5173, // پورت Vite (اختیاری ولی شفافه)
    },
})
