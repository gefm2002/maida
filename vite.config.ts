import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Configuración para SPA: todas las rutas deben servir index.html
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
