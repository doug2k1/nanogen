#!/usr/bin/env node
const path = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');
const nanogen = require('./index');
const configFile = process.argv.length > 2 ? process.argv[2] : 'site.config.js';

const configData = require(path.resolve(configFile));

nanogen.build(configData);
