import { copyFolderToTemp } from '@/test/utils/copyFolderToTemp'
import fse from 'fs-extra'
import cp from 'node:child_process'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { init } from './init'

vi.mock('@/libs/logger/logger')
vi.mock('node:child_process', () => ({
  default: {
    exec: vi.fn((_, callback) =>
      callback(null, { stdout: 'success', stderr: '' }),
    ),
  },
}))

describe('init', () => {
  let tempDir: string
  const initialCwd = process.cwd()

  beforeEach(() => {
    tempDir = copyFolderToTemp(path.resolve(__dirname, '../../test/mock'))
    // manually add empty package.json
    fse.writeFileSync(
      path.resolve(tempDir, './package.json'),
      JSON.stringify({ scripts: {} }, null, 2),
    )
    process.chdir(tempDir)
  })

  afterEach(() => {
    process.chdir(initialCwd)
    fse.removeSync(tempDir)
  })

  it('should initialize site', async () => {
    await init()

    expect(cp.exec).toHaveBeenCalledWith('npm init -y', expect.any(Function))
    expect(cp.exec).toHaveBeenCalledWith(
      'npm i -D nanogen --loglevel error',
      expect.any(Function),
    )
    expect(fse.existsSync('./site.config.js')).toBe(true)
    expect(fse.existsSync('./package.json')).toBe(true)
    expect(fse.existsSync('./src')).toBe(true)
  })
})
