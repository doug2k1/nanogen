const sinon = require('sinon');
const expect = require('chai').expect;
const liveServer = require('live-server');
const server = require('../../lib/utils/server');

describe('server', function() {
  beforeEach(function() {
    sinon.stub(liveServer, 'start');
  });

  afterEach(function() {
    liveServer.start.restore();
  });

  it('should start with parameters', function() {
    // when
    server.serve({ path: 'foo', port: 3333 });

    // then
    expect(liveServer.start.calledOnce).to.be.true;
    expect(liveServer.start.getCall(0).args[0]).to.deep.equal({
      port: 3333,
      root: 'foo',
      open: false,
      logLevel: 0
    });
  });
});
