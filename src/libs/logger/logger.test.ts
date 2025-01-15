import chalk from 'chalk'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from 'vitest'
import { log } from './logger'

describe('logger', () => {
  let consoleLogSpy: MockInstance

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
  })

  it('logs info message', () => {
    log.info('test message')

    expect(consoleLogSpy).toHaveBeenCalledWith(
      `${chalk.gray('[nanogen]')} test message`,
    )
  })

  it('logs success message', () => {
    log.success('test message')

    expect(consoleLogSpy).toHaveBeenCalledWith(
      `${chalk.gray('[nanogen]')} ${chalk.green('test message')}`,
    )
  })

  it('logs error message', () => {
    log.error('test message')

    expect(consoleLogSpy).toHaveBeenCalledWith(
      `${chalk.gray('[nanogen]')} ${chalk.red('test message')}`,
    )
  })
})
