import { server } from '@/libs/server/server'
import { build } from '@/modules/build/build'
import chokidar from 'chokidar'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { serve } from './serve'

// Mock event emitter for chokidar
const mockOn = vi.fn()

vi.mock('chokidar', () => ({
  default: {
    watch: vi.fn(() => ({
      on: mockOn,
    })),
  },
}))

vi.mock('@/libs/server/server', () => ({
  server: {
    serve: vi.fn(() => ({
      reload: vi.fn(),
    })),
  },
}))

vi.mock('@/modules/build/build')
vi.mock('@/libs/logger/logger')

describe('serve', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize server with correct parameters', () => {
    serve({ build: { outputPath: './public' } }, { port: '3333' })

    expect(server.serve).toHaveBeenCalledWith({
      path: './public',
      port: 3333,
    })
  })

  it('should watch source directory for changes', () => {
    serve({ build: { srcPath: './src', outputPath: './public' } }, { port: '3333' })

    expect(chokidar.watch).toHaveBeenCalledWith('./src', {
      ignoreInitial: true,
    })
  })

  it('should rebuild and reload when files change', async () => {
    vi.useFakeTimers()
    const mockReload = vi.fn()

    vi.mocked(server.serve).mockReturnValue({ reload: mockReload })
    serve({ build: { srcPath: './src', outputPath: './public' } }, { port: '3333' })

    // Get the callback function passed to chokidar's on method
    const fileChangeCallback = mockOn.mock.lastCall?.[1]

    // Simulate file change
    if (fileChangeCallback) {
      fileChangeCallback()
    }

    // Wait for debounce
    vi.advanceTimersToNextTimer()

    expect(build).toHaveBeenCalled()
    expect(mockReload).toHaveBeenCalled()
  })
})
