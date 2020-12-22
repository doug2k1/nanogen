const buildDefaults = {
  srcPath: './src',
  outputPath: './public',
  cleanUrls: true,
};

/**
 * Parse options, setting the defaults on missing values
 */
const parseOptions = (options) => {
  const { srcPath, outputPath, cleanUrls } = Object.assign(
    {},
    buildDefaults,
    options.build
  );
  const site = options.site || {};

  return { srcPath, outputPath, cleanUrls, site };
};

module.exports = {
  parseOptions,
};
