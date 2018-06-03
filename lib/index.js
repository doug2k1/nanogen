const fse = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const frontMatter = require('front-matter');
const glob = require('glob');
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const server = require('./utils/server');
const log = require('./utils/logger');

const buildDefaults = { srcPath: './src', outputPath: './public' };

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
const _buildPage = (file, { srcPath, outputPath, site }) => {
  const fileData = path.parse(file);
  const destPath = path.join(outputPath, fileData.dir);

  // create destination directory
  fse.mkdirsSync(destPath);

  // read page file
  const data = fse.readFileSync(`${srcPath}/pages/${file}`, 'utf-8');

  // render page
  const pageData = frontMatter(data);
  const templateConfig = {
    site,
    page: pageData.attributes
  };

  let pageContent;

  // generate page content according to file type
  switch (fileData.ext) {
    case '.md':
      pageContent = marked(pageData.body);
      break;
    case '.ejs':
      pageContent = ejs.render(pageData.body, templateConfig, {
        filename: `${srcPath}/pages/${file}`
      });
      break;
    default:
      pageContent = pageData.body;
  }

  // render layout with page contents
  const layout = _loadLayout(pageData.attributes.layout || 'default', {
    srcPath
  });

  const completePage = ejs.render(
    layout.data,
    Object.assign({}, templateConfig, {
      body: pageContent,
      filename: layout.file
    })
  );

  // save the html file
  fse.writeFileSync(`${destPath}/${fileData.name}.html`, completePage);
};

/**
 * Build the site
 */
const build = (options = {}) => {
  log.info('Building site...');
  const startTime = process.hrtime();

  const { srcPath, outputPath } = Object.assign(
    {},
    buildDefaults,
    options.build
  );
  const site = options.site || {};

  // clear destination folder
  fse.emptyDirSync(outputPath);

  // copy assets folder
  if (fse.existsSync(`${srcPath}/assets`)) {
    fse.copySync(`${srcPath}/assets`, outputPath);
  }

  // read pages
  const files = glob.sync('**/*.@(md|ejs|html)', { cwd: `${srcPath}/pages` });

  files.forEach(file => _buildPage(file, { srcPath, outputPath, site }));

  // display build time
  const timeDiff = process.hrtime(startTime);
  const duration = timeDiff[0] * 1000 + timeDiff[1] / 1e6;
  log.success(`Site built succesfully in ${duration}ms`);
};

/**
 * Serve the site in watch mode
 */
const serve = (config, flags) => {
  log.info(`Starting local server at http://localhost:${flags.port}`);

  server.serve({ path: config.build.outputPath, port: flags.port });

  chokidar.watch(config.build.srcPath).on(
    'all',
    debounce(() => {
      build(config);
      log.info('Waiting for changes...');
    }, 500)
  );
};

module.exports = {
  build,
  serve
};
