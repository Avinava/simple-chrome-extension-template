import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import { fileURLToPath } from 'node:url'
import manifest from './src/manifest.json' with { type: 'json' }
import pkg from './package.json' with { type: 'json' }

const r = (p) => fileURLToPath(new URL(p, import.meta.url))

// Path aliases. KEEP IN SYNC with `tsconfig.json` (paths) and `vitest.config.ts` (resolve.alias).
const alias = {
  '@core': r('./src/core'),
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
    build: { outDir: 'dist' },
    // Strip console/debugger from production bundles (dev keeps them for debugging).
    esbuild: isProduction ? { drop: ['console', 'debugger'] } : {},
    server: {
      port: 5173,
      hmr: { port: 5174 },
    },
  }
})
