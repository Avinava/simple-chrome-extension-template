import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './src/manifest.json'

export default defineConfig({
  plugins: [
    crx({ manifest })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'src/popup/popup.html',
        options: 'src/options/options.html',
        sidepanel: 'src/sidepanel/sidepanel.html'
      }
    }
  },
  server: {
    port: 5173,
    hmr: {
      port: 5174
    }
  }
})
