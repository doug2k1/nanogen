import { copyFolderToTemp } from '@/test/utils/copyFolderToTemp'
import fse from 'fs-extra'
import cp from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { init } from './init'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

vi.mock('@/libs/logger/logger')
vi.mock('node:child_process', () => ({
  default: {
    exec: vi.fn((_, callback) => callback(null, { stdout: 'success', stderr: '' })),
  },
}))

describe('init', () => {
  let tempDir: string
  const initialCwd = process.cwd()

  beforeEach(() => {
    tempDir = copyFolderToTemp(path.resolve(__dirname, '../../test/mock'))
    process.chdir(tempDir)
  })

  afterEach(() => {
    process.chdir(initialCwd)
    fse.removeSync(tempDir)
  })

  it('should initialize site', async () => {
    await init('../../../template')

    expect(cp.exec).toHaveBeenCalledWith('npm i --loglevel error', expect.any(Function))
    expect(fse.existsSync('./site.config.js')).toBe(true)
    expect(fse.existsSync('./package.json')).toBe(true)
    expect(fse.existsSync('./src')).toBe(true)
  })
})
