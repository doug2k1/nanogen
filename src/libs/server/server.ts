import http from 'node:http'
import sirv from 'sirv'
import { WebSocketServer } from 'ws'

export const server = {
  serve({ path, port = 3000 }: { path: string; port?: number }) {
    const staticHandler = sirv(path, {
      dev: true,
      etag: true,
      single: true,
    })

    const server = http.createServer((req, res) => {
      staticHandler(req, res)
    })

    // Setup WebSocket for live reload
    const wss = new WebSocketServer({ server })

    wss.on('connection', (ws) => {
      ws.on('error', console.error)
    })

    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })

    return {
      reload: () => {
        wss.clients.forEach((client) => {
          client.send('reload')
        })
      },
    }
  },
}
