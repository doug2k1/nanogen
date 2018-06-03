module.exports = {
  build: {
    srcPath: './src',
    outputPath: './docs'
  },
  site: {
    title: 'Nanogen',
    description: 'Minimalist static site generator in Node.js',
    basePath: process.env.NODE_ENV === 'production' ? '/nanogen' : ''
  }
};
