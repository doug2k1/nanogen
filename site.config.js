const projects = require('./src/data/projects');

module.exports = {
  build: {
    srcPath: './src',
    outputPath: './docs'
  },
  site: {
    title: 'nanogen',
    description: 'Minimalist static site generator in Node.js',
    basePath: '',
    projects
  }
};
