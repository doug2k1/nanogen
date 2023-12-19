const path = require('path');
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const server = require('../utils/server');
const log = require('../utils/logger');
const build = require('./build');
const { parseOptions } = require('../utils/parser');

const CONFIG_FILE_NAME = 'site.config.js';

/**
 * Serve the site in watch mode
 */
const serve = (options, flags) => {
  log.info(`Starting local server at http://localhost:${flags.port}`);

  const { srcPath, outputPath } = parseOptions(options);

  build(options);
  server.serve({ path: outputPath, port: flags.port });

  chokidar
    .watch([`./${CONFIG_FILE_NAME}`, srcPath], { ignoreInitial: true })
    .on(
      'all',
      debounce((eventName, targetName) => {
        if (CONFIG_FILE_NAME === targetName) {
          // Invalidate the require cache
          delete require.cache[require.resolve(path.resolve(flags.config))];

          // Reload the config file
          const updatedConfigFile = require(path.resolve(flags.config));
          const { site } = parseOptions(updatedConfigFile);

          options.site = site || options.site;
          log.info('Site config updated!');
        }

        build(options);
        log.info('Waiting for changes...');
      }, 500)
    );
};

module.exports = serve;
