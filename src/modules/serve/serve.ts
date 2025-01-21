import { Options, parseOptions } from '@/libs/config/parser'
import { log } from '@/libs/logger/logger'
import { server } from '@/libs/server/server'
import { build } from '@/modules/build/build'
import chokidar from 'chokidar'
import debounce from 'lodash.debounce'

export interface ServeFlags {
  port?: string
}

/**
 * Serve the site in watch mode
 */
export const serve = (options: Options, flags: ServeFlags): void => {
  log.info(`Starting local server at http://localhost:${flags.port}`)

  const { srcPath, outputPath } = parseOptions(options)

  build(options, 'development')

  const { reload } = server.serve({
    path: outputPath,
    port: Number(flags.port),
  })

  chokidar.watch(srcPath, { ignoreInitial: true }).on(
    'all',
    debounce(() => {
      build(options, 'development')
      reload()
      log.info('Waiting for changes...')
    }, 500),
  )
}
