import { defineConfig } from 'vite';
import { join } from "node:path";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    emptyOutDir: true,
  },
  root: join(__dirname, "src", "renderer", "engines")
});
