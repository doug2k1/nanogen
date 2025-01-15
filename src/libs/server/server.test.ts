import liveServer from 'live-server'
import { describe, expect, it, vi } from 'vitest'
import { server } from './server'

vi.mock('live-server')

describe('server', function () {
  it('should start with parameters', function () {
    // when
    server.serve({ path: 'foo', port: 3333, open: true })

    // then
    expect(liveServer.start).toHaveBeenCalledWith({
      port: 3333,
      root: 'foo',
      open: true,
      logLevel: 0,
    })
  })
})
