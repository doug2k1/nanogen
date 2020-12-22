const path = require('path');
const fse = require('fs-extra');
const cp = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const log = require('../utils/logger');

const init = () => {
  log.info('Initializing a new Nanogen site ...');

  // copy template files
  fse.copySync(path.resolve(__dirname, '../../template'), '.');

  cp.execSync('npm init -y');

  // add scripts to package.json
  const packageJSON = require(path.relative(__dirname, './package.json'));
  packageJSON.scripts = {
    start: 'nanogen start',
    build: 'nanogen build',
  };
  fse.writeFileSync('./package.json', JSON.stringify(packageJSON, null, 2));

  // install nanogen
  const spinner = ora('Installing dependencies...').start();
  cp.exec('npm i -D nanogen --loglevel error', () => {
    spinner.succeed();

    log.success(`Site initialized succesfully!`);
    log.info(
      chalk`Now you can run:
  {cyan npm start}      to start your new site, or
  {cyan npm run build}  to build it into the 'public' folder.`
    );
  });
};

module.exports = init;
