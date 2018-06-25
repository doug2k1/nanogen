const path = require('path');
const fse = require('fs-extra');
const cp = require('child_process');
const chalk = require('chalk');
const log = require('../utils/logger');

const init = newSiteName => {
  const newSitePath = path.relative('.', newSiteName);

  if (fse.existsSync(newSitePath)) {
    throw new Error(`Destination path '${newSitePath}' already exists.`);
  }

  log.info(`Creating new Nanogen site '${newSiteName}'`);

  // create destination folder
  fse.mkdirsSync(newSitePath);

  // copy template files
  fse.copySync(path.resolve(__dirname, '../template'), newSitePath);

  cp.execSync('npm init -y', {
    cwd: newSitePath
  });

  // add scripts to package.json
  const packageJSON = require(path.relative(
    __dirname,
    `${newSitePath}/package.json`
  ));
  packageJSON.scripts = {
    start: 'nanogen -w --open',
    build: 'nanogen'
  };
  fse.writeFileSync(
    `${newSitePath}/package.json`,
    JSON.stringify(packageJSON, null, 2)
  );

  // install nanogen
  log.info('Installing dependencies locally...');
  cp.execSync('npm i -D nanogen --loglevel error', {
    cwd: newSitePath
  });

  log.success(`Site ${newSiteName} created succesfully!`);
  log.info(
    chalk`Change to your site directory with {cyan cd ${newSiteName}} and run:
  {cyan npm start}      to start your new site, or
  {cyan npm run build}  to build it into the 'public' folder.`
  );
};

module.exports = init;
