import {defineConfig} from 'vite';
import {nodePolyfills} from 'vite-plugin-node-polyfills';
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import reactSWC from '@vitejs/plugin-react-swc';
import react from '@vitejs/plugin-react';

const isWebContainer = globalThis.process?.versions?.webcontainer;

console.log(globalThis.process.env)

export default defineConfig({
  base: '/',
  plugins: [
    pluginRewriteAll(),
    nodePolyfills(),
    isWebContainer
      ? react()
      : reactSWC(),
  ],
  build: {
    chunkSizeWarningLimit: 750,
  },
  server: {
    strictPort: true,
    port: 5101,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
