module.exports = {
  root: true,
  plugins: ['node'],
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  rules: {
    'no-console': 0
  },
  env: {
    mocha: true,
    node: true
  }
};
