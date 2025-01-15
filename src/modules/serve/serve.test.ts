import { server } from '@/libs/server/server'
import chokidar from 'chokidar'
import { describe, expect, it, vi } from 'vitest'
import { serve } from './serve'

vi.mock('chokidar', () => ({
  default: {
    watch: vi.fn(() => ({
      on: vi.fn(),
    })),
  },
}))

vi.mock('@/libs/server/server')
vi.mock('@/modules/build/build')
vi.mock('@/libs/logger/logger')

describe('serve', () => {
  it('should call server.serve', () => {
    serve({ build: { outputPath: './public' } }, { port: '3333' })

    expect(server.serve).toHaveBeenCalledWith({
      path: './public',
      port: 3333,
    })
  })

  it('should call chokidar.watch', () => {
    serve(
      { build: { srcPath: './src', outputPath: './public' } },
      { port: '3333' },
    )

    expect(chokidar.watch).toHaveBeenCalledWith('./src', {
      ignoreInitial: true,
    })
  })

  // TODO: improve serve test to check if file modifications triggers a new build
})
