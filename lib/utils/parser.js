const buildDefaults = { srcPath: './src', outputPath: './public' };

/**
 * Parse options, setting the defaults on missing values
 */
const parseOptions = options => {
  const { srcPath, outputPath } = Object.assign(
    {},
    buildDefaults,
    options.build
  );
  const site = options.site || {};

  return { srcPath, outputPath, site };
};

module.exports = {
  parseOptions
};
