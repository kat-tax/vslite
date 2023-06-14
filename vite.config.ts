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
    chunkSizeWarningLimit: 750,
  },
  server: {
    strictPort: true,
    port: 5101,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    host: globalThis.process?.env.REPL_HOME ? true : 'localhost'
  },
});
