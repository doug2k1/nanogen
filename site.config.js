const projects = require('./src/data/projects');

module.exports = {
  build: {
    srcPath: './src',
    outputPath: process.env.NODE_ENV === 'production' ? './docs' : './public'
  },
  site: {
    title: 'NanoGen',
    description: 'Micro Static Site Generator in Node.js',
    basePath: process.env.NODE_ENV === 'production' ? '/nanogen' : '',
    projects
  }
};
