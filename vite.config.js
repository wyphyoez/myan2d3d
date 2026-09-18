import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const previewMarket = {
  set: null,
  value: null,
  twoD: null,
  collectedAt: null,
  status: { state: 'WAITING', session: null, nextSession: { label: '11:00 AM' } },
}

function localApiPreview() {
  return {
    name: 'local-api-preview',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith('/api/')) return next()
        response.setHeader('content-type', 'application/json')
        if (request.url.startsWith('/api/2d/history')) return response.end(JSON.stringify({ results: [] }))
        if (request.url.startsWith('/api/market/status')) return response.end(JSON.stringify(previewMarket.status))
        if (request.url.startsWith('/api/2d/latest')) return response.end(JSON.stringify(previewMarket))
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localApiPreview()],
})
