import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    // Ghost's static export owns /assets, /public, /content — keep our
    // bundle namespaced so the dist merge can never collide with it.
    assetsDir: 'garage-assets',
  },
})
