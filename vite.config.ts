import { resolve } from 'path'
import {defineConfig} from 'vite';
import {nodePolyfills} from 'vite-plugin-node-polyfills';
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import reactSWC from '@vitejs/plugin-react-swc';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: globalThis.process?.env.VITE_BASE || '/',
  plugins: [
    pluginRewriteAll(),
    nodePolyfills(),
    globalThis.process?.versions?.webcontainer
      ? react()
      : reactSWC(),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'VSLite',
      // the proper extensions will be added
      fileName: 'index',
    },
 
    chunkSizeWarningLimit: 3500,
  },
  server: {
    port: 5101,
    host: globalThis.process?.env.VITE_HOST || 'localhost',
    strictPort: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
