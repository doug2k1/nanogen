const fse = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const frontMatter = require('front-matter');
const glob = require('glob');
const log = require('../utils/logger');
const { parseOptions } = require('../utils/parser');

/**
 * Build the site
 */
const build = (options = {}) => {
  log.info('Building site...');
  const startTime = process.hrtime();

  const { srcPath, outputPath, cleanUrls, site } = parseOptions(options);

  // clear destination folder
  fse.emptyDirSync(outputPath);

  // copy assets folder
  if (fse.existsSync(`${srcPath}/assets`)) {
    fse.copySync(`${srcPath}/assets`, outputPath);
  }

  // read pages
  const files = glob.sync('**/*.@(md|ejs|html)', { cwd: `${srcPath}/pages` });

  files.forEach((file) =>
    _buildPage(file, { srcPath, outputPath, cleanUrls, site })
  );

  // display build time
  const timeDiff = process.hrtime(startTime);
  const duration = timeDiff[0] * 1000 + timeDiff[1] / 1e6;
  log.success(`Site built succesfully in ${duration}ms`);
};

/**
 * Loads a layout file
 */
const _loadLayout = (layout, { srcPath }) => {
  const file = `${srcPath}/layouts/${layout}.ejs`;
  const data = fse.readFileSync(file, 'utf-8');

  return { file, data };
};

/**
 * Build a single page
 */
const _buildPage = (file, { srcPath, outputPath, cleanUrls, site }) => {
  const fileData = path.parse(file);
  let destPath = path.join(outputPath, fileData.dir);

  // create extra dir if generating clean URLs and filename is not index
  if (cleanUrls && fileData.name !== 'index') {
    destPath = path.join(destPath, fileData.name);
  }

  // create destination directory
  fse.mkdirsSync(destPath);

  // read page file
  const data = fse.readFileSync(`${srcPath}/pages/${file}`, 'utf-8');

  // render page
  const pageData = frontMatter(data);
  const templateConfig = {
    site,
    page: pageData.attributes,
  };

  let pageContent;
  const pageSlug = file.split(path.sep).join('-');

  // generate page content according to file type
  switch (fileData.ext) {
    case '.md':
      pageContent = marked(pageData.body);
      break;
    case '.ejs':
      pageContent = ejs.render(pageData.body, templateConfig, {
        filename: `${srcPath}/page-${pageSlug}`,
      });
      break;
    default:
      pageContent = pageData.body;
  }

  // render layout with page contents
  const layoutName = pageData.attributes.layout || 'default';
  const layout = _loadLayout(layoutName, {
    srcPath,
  });

  const completePage = ejs.render(
    layout.data,
    Object.assign({}, templateConfig, {
      body: pageContent,
      filename: `${srcPath}/layout-${layoutName}`,
    })
  );

  // save the html file
  if (cleanUrls) {
    fse.writeFileSync(`${destPath}/index.html`, completePage);
  } else {
    fse.writeFileSync(`${destPath}/${fileData.name}.html`, completePage);
  }
};

module.exports = build;
