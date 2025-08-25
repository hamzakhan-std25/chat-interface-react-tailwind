import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

  ],
  preview: {
    port: 4000, // Set your preferred port
    strictPort: true // Optional: fail if port is already in use
  }

})
