import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    outDir: '.vite/build/preload',
    rollupOptions: {
      external: ['electron', 'path', '@electron-toolkit/preload', 'crypto'],
    }
  },
});
