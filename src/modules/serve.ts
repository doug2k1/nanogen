import chokidar from 'chokidar'
import debounce from 'lodash.debounce'
import { log } from '../utils/logger'
import { Options, parseOptions } from '../utils/parser'
import { server } from '../utils/server'
import { build } from './build'

/**
 * Serve the site in watch mode
 */

export interface ServeFlags {
  port?: string
}

export const serve = (options: Options, flags: ServeFlags): void => {
  log.info(`Starting local server at http://localhost:${flags.port}`)

  const { srcPath, outputPath } = parseOptions(options)

  build(options)
  server.serve({ path: outputPath, port: Number(flags.port) })
  chokidar.watch(srcPath, { ignoreInitial: true }).on(
    'all',
    debounce(() => {
      build(options)
      log.info('Waiting for changes...')
    }, 500),
  )
}
