import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyBg2eAssets } from 'bg2e-js/ts/bg2e-vite.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copyBg2eAssets()
  ],
  optimizeDeps: {
    exclude: ['bg2e-js']
  },
  assetsInclude: ["**/*.glsl"]
})
