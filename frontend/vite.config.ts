import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/oauth2': 'http://localhost:8080',
            '/login': 'http://localhost:8080',
            '/api': 'http://localhost:8080',
        },
        port: 5173,
    },
})


