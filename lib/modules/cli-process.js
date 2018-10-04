const path = require('path');
const nanogen = require('../index');
const log = require('../utils/logger');

const cliProcess = (input = [], flags = {}) => {
  // command
  const command = input.length > 0 ? input[0] : null;

  // config
  const config = flags.config ? require(path.resolve(flags.config)) : {};

  switch (command) {
    case 'init':
      nanogen.init();
      break;

    case 'start': {
      nanogen.serve(config, flags);
      break;
    }

    case 'build': {
      nanogen.build(config);
      break;
    }

    default:
      log.error('Invalid command');
  }
};

module.exports = cliProcess;
