const fse = require('fs-extra');
const expect = require('chai').expect;
const nanogen = require('../lib');

const mockConfig = {
  build: {
    srcPath: './test/mock/src',
    outputPath: './test/mock/public'
  },
  site: {
    title: 'test-site'
  }
};

describe('build', function() {
  it('should empty output path', function() {
    // given
    const testFile = `${mockConfig.build.outputPath}/test.txt`;
    fse.writeFileSync(testFile, 'test');

    // when
    nanogen.build(mockConfig);

    //then
    expect(fse.existsSync(testFile)).to.be.false;
  });

  it('should copy assets folder', function() {
    // when
    nanogen.build(mockConfig);

    // then
    expect(fse.existsSync(`${mockConfig.build.outputPath}/assets/asset.txt`)).to
      .be.true;
    expect(
      fse.existsSync(`${mockConfig.build.outputPath}/assets/sub/another.txt`)
    ).to.be.true;
  });

  it('should use the default layout', function() {
    // when
    nanogen.build(mockConfig);

    // then
    const page = fse.readFileSync(
      `${mockConfig.build.outputPath}/md1.html`,
      'utf-8'
    );
    expect(page).to.have.string('default-layout-start');
    expect(page).to.have.string('default-layout-end');
  });

  it('should use custom layout', function() {
    // when
    nanogen.build(mockConfig);

    // then
    const page = fse.readFileSync(
      `${mockConfig.build.outputPath}/custom.html`,
      'utf-8'
    );
    expect(page).to.have.string('custom-layout-start');
    expect(page).to.have.string('custom-layout-end');
  });

  it('should generate pages from markdown', function() {
    // when
    nanogen.build(mockConfig);

    // then
    const page1 = fse.readFileSync(
      `${mockConfig.build.outputPath}/md1.html`,
      'utf-8'
    );
    expect(page1).to.have.string('<p>markdown-page-1</p>');

    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/md/md2.html`,
      'utf-8'
    );
    expect(page2).to.have.string('<p>markdown-page-2</p>');
  });

  it('should generate pages from ejs', function() {
    // when
    nanogen.build(mockConfig);

    // then
    const page1 = fse.readFileSync(
      `${mockConfig.build.outputPath}/ejs1.html`,
      'utf-8'
    );
    expect(page1).to.have.string('<p>ejs-1</p>');

    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/ejs/ejs2.html`,
      'utf-8'
    );
    expect(page2).to.have.string('<p>ejs-2</p>');
  });

  it('should generate pages from html', function() {
    // when
    nanogen.build(mockConfig);

    // then
    const page1 = fse.readFileSync(
      `${mockConfig.build.outputPath}/html1.html`,
      'utf-8'
    );
    expect(page1).to.have.string('<p>html-1</p>');

    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/html/html2.html`,
      'utf-8'
    );
    expect(page2).to.have.string('<p>html-2</p>');
  });

  it('should inject site config', function() {
    // when
    nanogen.build(mockConfig);

    // then
    const page = fse.readFileSync(
      `${mockConfig.build.outputPath}/with-site-data.html`,
      'utf-8'
    );
    expect(page).to.have.string('site title on layout: test-site');
    expect(page).to.have.string('site title on page: test-site');
  });

  it('should inject front matter', function() {
    // when
    nanogen.build(mockConfig);

    // then
    const page1 = fse.readFileSync(
      `${mockConfig.build.outputPath}/with-front-matter-md.html`,
      'utf-8'
    );
    expect(page1).to.have.string('front-matter on layout: test-md');

    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/with-front-matter-ejs.html`,
      'utf-8'
    );
    expect(page2).to.have.string('front-matter on layout: test-ejs');
    expect(page2).to.have.string('front-matter on page: test-ejs');
  });
});
