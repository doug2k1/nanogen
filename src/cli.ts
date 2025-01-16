#!/usr/bin/env node
import meow from 'meow'
import pc from 'picocolors'
import { cliProcess } from './modules/cli/cli-process'

const cli = meow(
  `
    ${pc.yellow('Initialize a new site:')}

      ${pc.cyan('$ nanogen init')}

    ${pc.yellow('Start the current site:')}

      ${pc.cyan('$ nanogen start [options]')}

    ${pc.yellow('Build the current site:')}

      ${pc.cyan('$ nanogen build [options]')}

    ${pc.underline(pc.yellow('Options'))}
      ${pc.cyan('-c, --config <file-path>')}  Path to the config file (default: site.config.js)
      ${pc.cyan('-p, --port <port-number>')}  Port to use for local server (default: 3000)
      
      ${pc.cyan('-h, --help')}                Display this help text
      ${pc.cyan('-v, --version')}             Display Nanogen version
  `,
  {
    importMeta: import.meta,
    flags: {
      config: {
        type: 'string',
        default: 'site.config.js',
        shortFlag: 'c',
      },
      port: {
        type: 'string',
        default: '3000',
        shortFlag: 'p',
      },
      help: {
        type: 'boolean',
        shortFlag: 'h',
      },
      version: {
        type: 'boolean',
        shortFlag: 'v',
      },
    },
  },
)

cliProcess(cli.input, cli.flags)
