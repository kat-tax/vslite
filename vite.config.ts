import {defineConfig} from 'vite';
import {nodePolyfills} from 'vite-plugin-node-polyfills';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
  ],
  build: {
    chunkSizeWarningLimit: 750,
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
