#!/usr/bin/env node
const chalk = require('chalk');
const meow = require('meow');
const cliProcess = require('./modules/cli-process');

const cli = meow(
  chalk`
    {underline {yellow Usage}}
      To create a new site:

        {cyan $ nanogen new <site-name>}

      To build the current site:

        {cyan $ nanogen [config-file] [options]}

        The config file parameter defaults to 'site-config.js' if not informed.

    {underline {yellow Options}}
      {cyan -w, --watch}     Start local server and watch for file changes
      {cyan -p, --port}      Port to use for local server (default: 3000)
      {cyan --open}          Automatically open the site in the default browser
      
      {cyan -h, --help}      Display this help text
      {cyan -v, --version}   Display nanogen version
  `,
  {
    flags: {
      watch: {
        type: 'boolean',
        default: false,
        alias: 'w'
      },
      port: {
        type: 'string',
        default: '3000',
        alias: 'p'
      },
      open: {
        type: 'boolean',
        default: false
      },
      help: {
        type: 'boolean',
        alias: 'h'
      },
      version: {
        type: 'boolean',
        alias: 'v'
      }
    }
  }
);

cliProcess(cli.input, cli.flags);
