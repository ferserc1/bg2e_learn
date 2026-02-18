import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// Path to bg2io package
const bg2ioPath = './node_modules/bg2io/';

// Path to copy the bg2io WebAssembly resources
const bg2ioDst = 'bg2e'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: `${bg2ioPath}/bg2io.js`,
          dest: bg2ioDst
        },
        {
          src: `${bg2ioPath}/bg2io.wasm`,
          dest: bg2ioDst
        }
      ]
    })
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".glsl": "text",
      },
    },
  },
  assetsInclude: ["**/*.glsl"]
})
