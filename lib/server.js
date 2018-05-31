const liveServer = require('live-server');

module.exports = {
  serve({ path, port }) {
    liveServer.start({
      port,
      root: path,
      open: false,
      logLevel: 0
    });
  }
};
