import {defineConfig} from 'vite';
import {nodePolyfills} from 'vite-plugin-node-polyfills';
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    pluginRewriteAll(),
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
