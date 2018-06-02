const sinon = require('sinon');
const expect = require('chai').expect;
const chokidar = require('chokidar');
const nanogen = require('../lib');
const server = require('../lib/utils/server');
const mockConfig = require('./mock/mock-config');

describe('serve', function() {
  beforeEach(function() {
    sinon.stub(server, 'serve');
    sinon.stub(nanogen, 'build');
    sinon.stub(chokidar, 'watch').returns({
      on: sinon.stub()
    });
  });

  afterEach(function() {
    server.serve.restore();
    nanogen.build.restore();
    chokidar.watch.restore();
  });

  it('should call server.serve', function() {
    // when
    nanogen.serve(mockConfig, { port: 3333 });

    // then
    expect(server.serve.calledOnce).to.be.true;
    expect(server.serve.getCall(0).args[0]).to.deep.equal({
      path: mockConfig.build.outputPath,
      port: 3333
    });
  });

  it('should call chokidar', function() {
    // when
    nanogen.serve(mockConfig, { port: 3333 });

    // then
    expect(chokidar.watch.calledOnce).to.be.true;
    expect(chokidar.watch.getCall(0).args[0]).to.equal(
      mockConfig.build.srcPath
    );
  });

  // TODO: improve serve test to check if file modifications triggers a new build
});
