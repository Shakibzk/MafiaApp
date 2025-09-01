/// <reference types="vite/client" />

import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        // ... Deine Plugins
    ],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                // optional: changeOrigin: true
            }
        }
    }
})