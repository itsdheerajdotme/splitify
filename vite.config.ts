// @ts-nocheck
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function updateSwVersionPlugin() {
  return {
    name: 'update-sw-version',
    closeBundle() {
      const swPath = path.resolve(__dirname, 'dist/sw.js')
      if (fs.existsSync(swPath)) {
        let content = fs.readFileSync(swPath, 'utf-8')
        const buildVersion = `splitify-v${Date.now()}`
        content = content.replace(/const CACHE_NAME = ['"][^'"]+['"];/, `const CACHE_NAME = '${buildVersion}';`)
        fs.writeFileSync(swPath, content, 'utf-8')
        console.log(`[SW Plugin] Updated dist/sw.js CACHE_NAME to ${buildVersion}`)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), updateSwVersionPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        help: path.resolve(__dirname, 'help/index.html'),
        terms: path.resolve(__dirname, 'terms/index.html'),
        privacy: path.resolve(__dirname, 'privacy/index.html'),
      },
    },
  },
})
