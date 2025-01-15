import { log } from '@/libs/logger/logger'
import { build } from '@/modules/build/build'
import { init } from '@/modules/init/init'
import { serve, ServeFlags } from '@/modules/serve/serve'
import path from 'node:path'

interface Flags extends ServeFlags {
  config?: string
}

export const cliProcess = async (input: string[] = [], flags: Flags = {}) => {
  // command
  const command = input.length > 0 ? input[0] : null

  if (command === 'init') {
    init()
  } else {
    // config
    const config = flags.config
      ? (await import(path.resolve(flags.config))).default
      : {}

    if (command === 'start') {
      serve(config, flags)
    } else if (command === 'build') {
      build(config)
    } else {
      log.error('Invalid command')
    }
  }
}
