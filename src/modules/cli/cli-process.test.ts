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
  it('should do nothing if missing or invalid command', async () => {
    await cliProcess()
    await cliProcess(['foo'])

    expect(init).not.toHaveBeenCalled()
    expect(build).not.toHaveBeenCalled()
    expect(serve).not.toHaveBeenCalled()
  })

  it('should initialize a new site', async () => {
    await cliProcess(['init'])

    expect(init).toHaveBeenCalled()
  })

  it('should start site with default options', async () => {
    await cliProcess(['start'])

    expect(serve).toHaveBeenCalledWith({}, {})
  })

  it('should start site with custom options', async () => {
    const flags = { config: 'src/test/mock/mock-config.js', port: '1111' }

    await cliProcess(['start'], flags)

    expect(serve).toHaveBeenCalledWith(mockConfig, flags)
  })

  it('should build site with default options', async () => {
    await cliProcess(['build'])

    expect(build).toHaveBeenCalledWith({})
  })

  it('should build site with custom options', async () => {
    const flags = { config: 'src/test/mock/mock-config.js' }

    await cliProcess(['build'], flags)

    expect(build).toHaveBeenCalledWith(mockConfig)
  })
})
