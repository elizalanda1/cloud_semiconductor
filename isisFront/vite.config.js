import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8069, // Cambia este número al puerto que desees
    cors: true, // Habilita CORS para aceptar peticiones de cualquier origen
    host: '0.0.0.0'
  },
})
