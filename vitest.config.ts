import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  test: {
    // happy-dom gives tests a lightweight DOM (window, document, CustomEvent, matchMedia).
    environment: 'happy-dom',
    globals: true,
  },
  // KEEP IN SYNC with `vite.config.js` (resolve.alias) and `tsconfig.json` (paths).
  resolve: {
    alias: {
      '@core': r('./src/core'),
      '@shared': r('./src/shared'),
      '@utils': r('./src/utils'),
    },
  },
})
