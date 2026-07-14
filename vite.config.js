import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import { fileURLToPath } from 'node:url'
import manifest from './src/manifest.json'
import pkg from './package.json'

const r = (p) => fileURLToPath(new URL(p, import.meta.url))

// Path aliases. KEEP IN SYNC with `tsconfig.json` (paths) and `vitest.config.ts` (resolve.alias).
const alias = {
  '@core': r('./src/core'),
  '@background': r('./src/background'),
  '@content': r('./src/content'),
  '@popup': r('./src/popup'),
  '@options': r('./src/options'),
  '@sidepanel': r('./src/sidepanel'),
  '@shared': r('./src/shared'),
  '@utils': r('./src/utils'),
}

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [
      // package.json is the single source of truth for the version.
      crx({ manifest: { ...manifest, version: pkg.version } }),
    ],
    resolve: { alias },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          popup: 'src/popup/popup.html',
          options: 'src/options/options.html',
          sidepanel: 'src/sidepanel/sidepanel.html',
        },
      },
    },
    // Strip console/debugger from production bundles (dev keeps them for debugging).
    esbuild: isProduction ? { drop: ['console', 'debugger'] } : {},
    server: {
      port: 5173,
      hmr: { port: 5174 },
    },
  }
})
