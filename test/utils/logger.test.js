const sinon = require('sinon');
const expect = require('chai').expect;
const chalk = require('chalk');
const log = require('../../lib/utils/logger');

describe('logger', function() {
  beforeEach(function() {
    sinon.spy(console, 'log');
  });

  afterEach(function() {
    console.log.restore();
  });

  it('should log info', function() {
    // when
    log.info('foo');

    // then
    expect(console.log.calledOnce).to.be.true;
    expect(console.log.getCall(0).args[0]).to.equal(
      chalk`{gray [nanogen]} foo`
    );
  });

  it('should log error', function() {
    // when
    log.error('foo');

    // then
    expect(console.log.calledOnce).to.be.true;
    expect(console.log.getCall(0).args[0]).to.equal(
      chalk`{gray [nanogen]} {red foo}`
    );
  });

  it('should log success', function() {
    // when
    log.success('foo');

    // then
    expect(console.log.calledOnce).to.be.true;
    expect(console.log.getCall(0).args[0]).to.equal(
      chalk`{gray [nanogen]} {green foo}`
    );
  });
});
