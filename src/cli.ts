#!/usr/bin/env node
import { Command } from 'commander'
import packageJSON from '../package.json'
import { cliProcess } from './modules/cli/cli-process'

const program = new Command()

program
  .name('nanogen')
  .description('A minimalist static site generator')
  .version(packageJSON.version, '-v, --version')
  .usage('<command> [options]')

program
  .command('init')
  .description('Initialize a new site')
  .action(async () => {
    await cliProcess({ command: 'init' })
  })

program
  .command('start')
  .description('Start the current site')
  .option('-c, --config <file-path>', 'Path to the config file', 'site.config.js')
  .option('-p, --port <port-number>', 'Port to use for local server', '3000')
  .action((options) => {
    cliProcess({
      command: 'start',
      options: { config: options.config, port: options.port },
    })
  })

program
  .command('build')
  .description('Build the current site')
  .option('-c, --config <file-path>', 'Path to the config file', 'site.config.js')
  .action((options) => {
    cliProcess({ command: 'build', options: { config: options.config } })
  })

program.parse()
