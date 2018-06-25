const sinon = require('sinon');
const expect = require('chai').expect;
const nanogen = require('../../lib');
const cli = require('../../lib/modules/cli-process');

describe.only('cli', function() {
  beforeEach(function() {
    sinon.stub(nanogen, 'build');
    sinon.stub(nanogen, 'serve');
  });

  afterEach(function() {
    nanogen.build.restore();
    nanogen.serve.restore();
  });

  it('should build with default config', function() {
    // when
    cli();

    // then
    expect(nanogen.build.calledOnce).to.be.true;
    expect(nanogen.build.getCall(0).args).to.eq;
  });
});
