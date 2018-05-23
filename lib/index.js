const fse = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const frontMatter = require('front-matter');
const glob = require('glob');

const buildDefaults = { srcPath: './src', outputPath: './public' };

const build = (options = {}) => {
  const site = Object.assign({}, options.site);
  const { srcPath, outputPath } = Object.assign(
    {},
    buildDefaults,
    options.build
  );

  // clear destination folder
  fse.emptyDirSync(outputPath);

  // copy assets folder
  fse.copy(`${srcPath}/assets`, `${outputPath}/assets`);

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
    const templateConfig = Object.assign(
      {},
      {
        site,
        page: pageData.attributes
      }
    );
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
    const layoutData = fse.readFileSync(layoutFileName, 'utf-8');
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
};

module.exports = {
  build(config) {
    return build(config);
  },

  serve(config) {
    console.log('Not implemented');
  }
};
