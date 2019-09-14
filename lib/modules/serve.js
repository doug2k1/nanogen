const fse = require('fs-extra');
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const server = require('../utils/server');
const log = require('../utils/logger');
const build = require('./build');
const { parseOptions } = require('../utils/parser');

/**
 * Serve the site in watch mode
 */
const serve = (options, flags) => {
  log.info(`Starting local server at http://localhost:${flags.port}`);

  const { srcPath, outputPath } = parseOptions(options);

    // clear destination folder
    fse.emptyDirSync(outputPath);

  build(options);
  server.serve({ path: outputPath, port: flags.port });

  chokidar.watch(srcPath, { ignoreInitial: true }).on(
    'all',
    debounce(() => {
      build(options);
      log.info('Waiting for changes...');
    }, 500)
  );
};

module.exports = serve;
