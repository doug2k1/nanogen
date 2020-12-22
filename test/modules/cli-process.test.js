const sinon = require('sinon');
const expect = require('chai').expect;
const nanogen = require('../../lib');
const cli = require('../../lib/modules/cli-process');
const mockConfig = require('../mock/mock-config');

describe('cli', function () {
  beforeEach(function () {
    sinon.stub(nanogen, 'init');
    sinon.stub(nanogen, 'build');
    sinon.stub(nanogen, 'serve');
  });

  afterEach(function () {
    nanogen.init.restore();
    nanogen.build.restore();
    nanogen.serve.restore();
  });

  it('should do nothing if missing or invalid command', () => {
    // when
    cli();

    // then
    expect(nanogen.init.called).to.be.false;
    expect(nanogen.build.called).to.be.false;
    expect(nanogen.serve.called).to.be.false;

    // when
    cli(['foo']);

    // then
    expect(nanogen.init.called).to.be.false;
    expect(nanogen.build.called).to.be.false;
    expect(nanogen.serve.called).to.be.false;
  });

  it('should initialize a new site', function () {
    // when
    cli(['init']);

    // then
    expect(nanogen.init.calledOnce).to.be.true;
  });

  it('should start site with default options', function () {
    // when
    cli(['start']);

    // then
    expect(nanogen.serve.calledOnce).to.be.true;
    expect(nanogen.serve.args[0]).to.deep.equal([{}, {}]);
  });

  it('should start site with custom options', function () {
    // given
    const flags = { config: 'test/mock/mock-config.js', port: 1111 };

    // when
    cli(['start'], flags);

    // then
    expect(nanogen.serve.calledOnce).to.be.true;
    expect(nanogen.serve.args[0]).to.deep.equal([mockConfig, flags]);
  });

  it('should build site with default options', function () {
    // when
    cli(['build']);

    // then
    expect(nanogen.build.calledOnce).to.be.true;
    expect(nanogen.build.args[0]).to.deep.equal([{}]);
  });

  it('should build site with custom options', function () {
    // given
    const flags = { config: 'test/mock/mock-config.js' };

    // when
    cli(['build'], flags);

    // then
    expect(nanogen.build.calledOnce).to.be.true;
    expect(nanogen.build.args[0]).to.deep.equal([mockConfig]);
  });
});
