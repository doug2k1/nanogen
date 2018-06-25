const path = require('path');
const fse = require('fs-extra');
const nanogen = require('../index');
const log = require('../utils/logger');

const cliProcess = (input = [], flags = {}) => {
  // command
  const command = input.length > 0 ? input[0] : 'site.config.js';

  if (command === 'new') {
    const newSiteName = input[1];

    if (!newSiteName) {
      throw new Error('invalid argument');
    }

    nanogen.init(newSiteName);
  } else {
    // load config file
    let configData = {};

    if (fse.existsSync(path.resolve(command))) {
      configData = require(path.resolve(command));
    } else {
      log.error('Invalid command');
      return;
    }

    if (flags.watch) {
      nanogen.serve(configData, flags);
    } else {
      nanogen.build(configData);
    }
  }
};

module.exports = cliProcess;
