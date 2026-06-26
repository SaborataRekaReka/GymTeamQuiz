import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'
import path from 'node:path'

const repoRoot = path.resolve(__dirname, '../../')

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
}

/**
 * Отдаём реальные ассеты проекта (/assets/...) из корня репозитория,
 * чтобы Vue-превью видело те же изображения, что и боевой квиз.
 */
function serveProjectAssets() {
  return {
    name: 'serve-project-assets',
    configureServer(server: { middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void } }) {
      server.middlewares.use((req, res, next) => {
        const url: string | undefined = req.url
        if (!url || !url.startsWith('/assets/')) return next()

        const clean = decodeURIComponent(url.split('?')[0])
        const filePath = path.join(repoRoot, clean)

        if (!filePath.startsWith(repoRoot) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          return next()
        }

        const ext = path.extname(filePath).toLowerCase()
        res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream')
        fs.createReadStream(filePath).pipe(res)
      })
    },
  }
}

export default defineConfig({
  root: __dirname,
  plugins: [
    serveProjectAssets(),
    vue({
      template: {
        transformAssetUrls: {
          includeAbsolute: false,
        },
      },
    }),
  ],
  server: {
    port: 4174,
    host: '127.0.0.1',
  },
})
