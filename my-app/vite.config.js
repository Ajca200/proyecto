import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
    host: '127.0.0.1', // <--- Añade o cambia esta línea
    port: 5173,      // O el puerto que estés usando
  },
})

