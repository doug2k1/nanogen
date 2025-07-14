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

  _buildSiteMap(files, { url: site.url, outputPath });

  site.index = _indexSitePages(files, { srcPath });

  files.forEach(file =>
    _buildPage(file, { srcPath, outputPath, cleanUrls, site })
  );

  // display build time
  const timeDiff = process.hrtime(startTime);
  const duration = timeDiff[0] * 1000 + timeDiff[1] / 1e6;
  log.success(`Site built succesfully in ${duration}ms`);
};

/**
 * Normalize slug
 */
const _slug = file => {
  return file.split(path.sep).join('-');
};

/**
 * Normalize file path into a URL
 */
const _normalizePath = (file, url = '') => {
  return `${url}/${file.replace(/(index)?.(ejs|htm|html|md)$/, '')}`.replace(
    /\/$/,
    ''
  );
};

/**
 * Returns an object with the entire website indexed and organized by tags
 */
const _indexSitePages = (files, { srcPath }) => {
  // index individual pages
  const pages = files.map(file => {
    const pageData = frontMatter(
      fse.readFileSync(`${srcPath}/pages/${file}`, 'utf-8')
    );
    const pageSlug = _slug(file);

    return {
      slug: pageSlug,
      tags: pageData.attributes.tags || [],
      title: pageData.attributes.title || '',
      subtitle: pageData.attributes.subtitle || '',
      description: pageData.attributes.description || '',
      keywords: pageData.attributes.keywords || [],
      lastModifiedAt: pageData.attributes.lastModifiedAt || '',
      url: _normalizePath(file)
    };
  });

  // index by tags
  const tags = pages
    .map(page => page.tags)
    .flat()
    .map(tag => {
      const tagPages = pages.filter(page => page.tags.includes(tag));

      return {
        slug: _slug(tag),
        title: tag,
        pages: tagPages
      };
    });

  return {
    pages,
    tags
  };
};

/**
 * Build a sitemap XML file
 */
const _buildSiteMap = (files, { url, outputPath }) => {
  const xml = [];

  xml.push('<?xml version="1.0" encoding="UTF-8"?>');
  xml.push(
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">'
  );

  files.forEach(file => {
    xml.push('\t<url>');
    xml.push(`\t\t<loc>${_normalizePath(file, url)}</loc>`);
    xml.push(`\t\t<lastmod>${new Date().toISOString()}</lastmod>`);
    xml.push('\t</url>');
  });

  xml.push('</urlset>');

  // save the sitemap file
  fse.writeFileSync(`${outputPath}/sitemap.xml`, xml.join('\n'));
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
 * Parses Markdown body variables
 */
const _parseMdBodyVars = (body, data) => {
  return body.replace(/\{\{([\w.]+)\}\}/g, (match, key) => {
    const keys = key.split('.');
    let value = data;

    for (const k of keys) {
      value = value ? value[k] : undefined;
    }

    return value !== undefined ? value : match;
  });
};

/**
 * Build a single page
 */
const _buildPage = (file, { srcPath, outputPath, cleanUrls, site }) => {
  const fileData = path.parse(file);
  let destPath = path.join(outputPath, fileData.dir);

  // add extra dir level if generating clean URLs and filename is not index
  if (cleanUrls && fileData.name !== 'index') {
    destPath = path.join(destPath, fileData.name);
  }

  // create destination directory
  fse.mkdirsSync(destPath);

  // read page file
  let data = fse.readFileSync(`${srcPath}/pages/${file}`, 'utf-8');

  // Parse Markdown body variables, only if the file is a Markdown file.
  // Timing is important. To work this needs to be done before parsing front-matter.
  if (fileData.ext === '.md') {
    data = _parseMdBodyVars(data, { site });
  }

  // render page
  const pageData = frontMatter(data);

  const templateConfig = {
    site,
    page: pageData.attributes
  };

  let pageContent;
  const pageSlug = _slug(file);

  // generate page content according to file type
  switch (fileData.ext) {
    case '.md':
      pageContent = marked(pageData.body);
      break;
    case '.ejs':
      pageContent = ejs.render(pageData.body, templateConfig, {
        filename: `${srcPath}/page-${pageSlug}`
      });
      break;
    default:
      pageContent = pageData.body;
  }

  // render layout with page contents
  const layoutName = pageData.attributes.layout || 'default';
  const layout = _loadLayout(layoutName, {
    srcPath
  });

  const completePage = ejs.render(
    layout.data,
    Object.assign({}, templateConfig, {
      body: pageContent,
      filename: `${srcPath}/layout-${layoutName}`,
      pagename: `${fileData.dir}${path.sep}${fileData.name}`
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
