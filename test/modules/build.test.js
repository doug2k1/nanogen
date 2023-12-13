const fse = require('fs-extra');
const expect = require('chai').expect;
const nanogen = require('../../lib');
const mockConfig = require('../mock/mock-config');

describe('build', function() {
  it('should empty output path', function() {
    // given
    fse.mkdirsSync(mockConfig.build.outputPath);
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
    expect(fse.existsSync(`${mockConfig.build.outputPath}/asset.txt`)).to.be
      .true;
    expect(fse.existsSync(`${mockConfig.build.outputPath}/sub/another.txt`)).to
      .be.true;
  });

  it('should use the default layout', function() {
    // when
    nanogen.build(mockConfig);

    // then
    const page = fse.readFileSync(
      `${mockConfig.build.outputPath}/md1/index.html`,
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
      `${mockConfig.build.outputPath}/custom/index.html`,
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
      `${mockConfig.build.outputPath}/md1/index.html`,
      'utf-8'
    );
    expect(page1).to.have.string('<p>markdown-page-1</p>');

    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/md/md2/index.html`,
      'utf-8'
    );
    expect(page2).to.have.string('<p>markdown-page-2</p>');
  });

  it('should generate pages from ejs', function() {
    // when
    nanogen.build(mockConfig);

    // then
    const page1 = fse.readFileSync(
      `${mockConfig.build.outputPath}/ejs1/index.html`,
      'utf-8'
    );
    expect(page1).to.have.string('<p>ejs-1</p>');

    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/ejs/ejs2/index.html`,
      'utf-8'
    );
    expect(page2).to.have.string('<p>ejs-2</p>');
  });

  it('should generate pages from html', function() {
    // when
    nanogen.build(mockConfig);

    // then
    const page1 = fse.readFileSync(
      `${mockConfig.build.outputPath}/html1/index.html`,
      'utf-8'
    );
    expect(page1).to.have.string('<p>html-1</p>');

    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/html/html2/index.html`,
      'utf-8'
    );
    expect(page2).to.have.string('<p>html-2</p>');
  });

  it('should not generate extra directory if filename is index', function() {
    // when
    nanogen.build(mockConfig);

    // then
    expect(
      fse.existsSync(
        `${mockConfig.build.outputPath}/with-index/index/index.html`
      )
    ).to.be.false;
    expect(
      fse.existsSync(`${mockConfig.build.outputPath}/with-index/index.html`)
    ).to.be.true;
  });

  it('should create sitemap.xml', function() {
    // when
    nanogen.build(mockConfig);

    // then
    expect(fse.existsSync(`${mockConfig.build.outputPath}/sitemap.xml`)).to.be
      .true;
  });

  it('should not generate extra directory if cleanUrls option is false', function() {
    // when
    const config = Object.assign({}, mockConfig);
    config.build = Object.assign({}, config.build, { cleanUrls: false });
    nanogen.build(config);

    // then
    expect(fse.existsSync(`${mockConfig.build.outputPath}/html1/index.html`)).to
      .be.false;
    expect(fse.existsSync(`${mockConfig.build.outputPath}/html1.html`)).to.be
      .true;
  });

  it('should inject site config', function() {
    // when
    nanogen.build(mockConfig);

    // then
    const page = fse.readFileSync(
      `${mockConfig.build.outputPath}/with-site-data/index.html`,
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
      `${mockConfig.build.outputPath}/with-front-matter-md/index.html`,
      'utf-8'
    );
    expect(page1).to.have.string('front-matter on layout: test-md');

    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/with-front-matter-ejs/index.html`,
      'utf-8'
    );
    expect(page2).to.have.string('front-matter on layout: test-ejs');
    expect(page2).to.have.string('front-matter on page: test-ejs');
  });

  it('should include partial on layout', function() {
    // when
    nanogen.build(mockConfig);

    // then
    const page1 = fse.readFileSync(
      `${mockConfig.build.outputPath}/ejs1/index.html`,
      'utf-8'
    );
    expect(page1).to.have.string('<p>test-partial-from-layout</p>');
  });

  it('should include partial on pages', function() {
    // when
    nanogen.build(mockConfig);

    // then
    const page1 = fse.readFileSync(
      `${mockConfig.build.outputPath}/ejs1/index.html`,
      'utf-8'
    );
    expect(page1).to.have.string('<p>test-partial-from-page-ejs1</p>');

    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/ejs/ejs2/index.html`,
      'utf-8'
    );
    expect(page2).to.have.string('<p>test-partial-from-page-ejs2</p>');
  });
});
