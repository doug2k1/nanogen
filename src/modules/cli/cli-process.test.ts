import { build } from '@/modules/build/build'
import { init } from '@/modules/init/init'
import { serve } from '@/modules/serve/serve'
import mockConfig from '@/test/mock/mock-config'
import { describe, expect, it, vi } from 'vitest'
import { cliProcess } from './cli-process'

vi.mock('@/modules/init/init')
vi.mock('@/modules/build/build')
vi.mock('@/modules/serve/serve')
vi.mock('@/libs/logger/logger')

describe('cli', () => {
  it('should initialize a new site', async () => {
    await cliProcess({ command: 'init' })

    expect(init).toHaveBeenCalled()
  })

  it('should start site with default options', async () => {
    await cliProcess({ command: 'start' })

    expect(serve).toHaveBeenCalledWith({}, {})
  })

  it('should start site with custom options', async () => {
    const options = { config: 'src/test/mock/mock-config.js', port: '1111' }

    await cliProcess({ command: 'start', options })

    expect(serve).toHaveBeenCalledWith(mockConfig, options)
  })

  it('should build site with default options', async () => {
    await cliProcess({ command: 'build' })

    expect(build).toHaveBeenCalledWith({})
  })

  it('should build site with custom options', async () => {
    const options = { config: 'src/test/mock/mock-config.js' }

    await cliProcess({ command: 'build', options })

    expect(build).toHaveBeenCalledWith(mockConfig)
  })
})
