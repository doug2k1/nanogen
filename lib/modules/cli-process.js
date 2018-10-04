const path = require('path');
const nanogen = require('../index');
const log = require('../utils/logger');

const cliProcess = (input = [], flags = {}) => {
  // command
  const command = input.length > 0 ? input[0] : null;

  if (command === 'init') {
    nanogen.init();
  } else {
    // config
    const config = flags.config ? require(path.resolve(flags.config)) : {};

    if (command === 'start') {
      nanogen.serve(config, flags);
    } else if (command === 'build') {
      nanogen.build(config);
    } else {
      log.error('Invalid command');
    }
  }
};
module.exports = cliProcess;
