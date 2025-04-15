import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ['mamiyahoo.com', 'mba-5173.jaruwat.dev'],
  },
  plugins: [react()],
})
