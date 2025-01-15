#!/usr/bin/env node
import chalk from 'chalk'
import meow from 'meow'
import { cliProcess } from './modules/cli/cli-process'

const cli = meow(
  `
    ${chalk.yellow('Initialize a new site:')}

      ${chalk.cyan('$ nanogen init')}

    ${chalk.yellow('Start the current site:')}

      ${chalk.cyan('$ nanogen start [options]')}

    ${chalk.yellow('Build the current site:')}

      ${chalk.cyan('$ nanogen build [options]')}

    ${chalk.underline(chalk.yellow('Options'))}
      ${chalk.cyan('-c, --config <file-path>')}  Path to the config file (default: site.config.js)
      ${chalk.cyan('-p, --port <port-number>')}  Port to use for local server (default: 3000)
      
      ${chalk.cyan('-h, --help')}                Display this help text
      ${chalk.cyan('-v, --version')}             Display Nanogen version
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
