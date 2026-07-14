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
      '@background': r('./src/background'),
      '@content': r('./src/content'),
      '@popup': r('./src/popup'),
      '@options': r('./src/options'),
      '@sidepanel': r('./src/sidepanel'),
      '@shared': r('./src/shared'),
      '@utils': r('./src/utils'),
    },
  },
})
