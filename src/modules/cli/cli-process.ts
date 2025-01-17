import { build } from '@/modules/build/build'
import { init } from '@/modules/init/init'
import { serve } from '@/modules/serve/serve'
import path from 'node:path'

interface Props {
  command: 'init' | 'start' | 'build'
  options?: {
    config?: string
    port?: string
  }
}

export const cliProcess = async ({ command, options = {} }: Props) => {
  // read config config
  const config = options.config
    ? (await import(path.resolve(options.config))).default
    : {}

  switch (command) {
    case 'init':
      init()
      break
    case 'start':
      serve(config, options)
      break
    case 'build':
      build(config)
      break
    default:
      break
  }
}
