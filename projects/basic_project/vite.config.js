import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Path to bg2io package
const bg2ioPath = './node_modules/bg2io/';

// Path to copy the bg2io WebAssembly resources
const bg2ioDst = 'bg2e'

export default defineConfig({
  plugins: [
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
});
