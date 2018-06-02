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

const build = (options = {}) => {
  log.info('Building site...');
  const startTime = process.hrtime();

  const site = Object.assign({}, options.site);
  const { srcPath, outputPath } = Object.assign(
    {},
    buildDefaults,
    options.build
  );

  // clear destination folder
  fse.emptyDirSync(outputPath);

  // copy assets folder
  if (fse.existsSync(`${srcPath}/assets`)) {
    fse.copySync(`${srcPath}/assets`, `${outputPath}/assets`);
  }

  // pre-load default layout
  const defaultLayoutData = fse.readFileSync(
    `${srcPath}/layouts/default.ejs`,
    'utf-8'
  );

  // read pages
  const files = glob.sync('**/*.@(md|ejs|html)', { cwd: `${srcPath}/pages` });

  files.forEach((file, i) => {
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
    const layout = pageData.attributes.layout || 'default';
    const layoutFileName = `${srcPath}/layouts/${layout}.ejs`;
    let layoutData = defaultLayoutData;

    if (layout !== 'default') {
      layoutData = fse.readFileSync(
        `${srcPath}/layouts/${layout}.ejs`,
        'utf-8'
      );
    }

    const completePage = ejs.render(
      layoutData,
      Object.assign({}, templateConfig, {
        body: pageContent,
        filename: layoutFileName
      })
    );

    // save the html file
    fse.writeFileSync(`${destPath}/${fileData.name}.html`, completePage);
  });

  // display build time
  const timeDiff = process.hrtime(startTime);
  const duration = timeDiff[0] * 1000 + timeDiff[1] / 1e6;
  log.success(`Site built succesfully in ${duration}ms`);
};

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
