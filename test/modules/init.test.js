const sinon = require('sinon');
const cp = require('child_process');
const fse = require('fs-extra');
const expect = require('chai').expect;
const nanogen = require('../../lib');
const mockSitePath = 'test/mock/site';

describe('init', function () {
  beforeEach(function () {
    fse.emptyDirSync(mockSitePath);
    process.chdir(mockSitePath);
    sinon.stub(cp, 'exec');
  });

  afterEach(function () {
    cp.exec.restore();
    process.chdir('.');
  });

  it('should initialize site', function () {
    nanogen.init();
    cp.exec.args[0][1]();
    expect(cp.exec.args[0][0]).to.equal('npm i -D nanogen --loglevel error');
    expect(fse.existsSync('./site.config.js')).to.be.true;
    expect(fse.existsSync('./package.json')).to.be.true;
    expect(fse.existsSync('./src')).to.be.true;
  });
});
