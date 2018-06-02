const chalk = require('chalk');

module.exports = {
  info(message) {
    console.log(chalk`{gray [nanogen]} ${message}`);
  },

  success(message) {
    console.log(chalk`{gray [nanogen]} {green ${message}}`);
  },

  error(message) {
    console.log(chalk`{gray [nanogen]} {red ${message}}`);
  }
};
