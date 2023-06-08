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
    strictPort: true,
    port: 5101,
    proxy: {
      '^/~/.+\.git': {
        target: 'http://127.0.0.1:5101',
        rewrite: path => path.replace('.git', ''),
      },
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
