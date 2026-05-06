import { defineConfig } from 'vite';
import { copyBg2eAssets } from 'bg2e-js/ts/bg2e-vite.js';

export default defineConfig({
  plugins: [
    copyBg2eAssets()
  ],
  optimizeDeps: {
    exclude: ['bg2e-js']
  },
  assetsInclude: ["**/*.glsl"]
})
