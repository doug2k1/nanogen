import http, {
  IncomingMessage,
  RequestListener,
  Server,
  ServerResponse,
} from 'node:http'
import sirv from 'sirv'
import { describe, expect, it, vi } from 'vitest'
import { WebSocketServer } from 'ws'
import { server } from './server'

vi.mock('node:http')
vi.mock('sirv')
vi.mock('ws')

describe('server', () => {
  it('should initialize server with correct parameters', () => {
    const mockStaticHandler = vi.fn()
    const mockServer = {
      listen: vi.fn((_, cb) => cb()),
    } as unknown as Server

    vi.mocked(sirv).mockReturnValue(mockStaticHandler)
    vi.mocked(http.createServer).mockImplementation((handler) => {
      ;(handler as RequestListener)({} as IncomingMessage, {} as ServerResponse)
      return mockServer
    })

    const instance = server.serve({ path: 'dist', port: 3333 })

    // Test sirv configuration
    expect(sirv).toHaveBeenCalledWith('dist', {
      dev: true,
      etag: true,
      single: true,
    })

    // Test static handler was called
    expect(mockStaticHandler).toHaveBeenCalled()

    // Test server initialization
    expect(http.createServer).toHaveBeenCalled()
    expect(mockServer.listen).toHaveBeenCalledWith(3333, expect.any(Function))

    // Test WebSocket server initialization
    expect(WebSocketServer).toHaveBeenCalledWith({ server: mockServer })

    // Test reload method exists
    expect(instance.reload).toBeDefined()
  })
})
