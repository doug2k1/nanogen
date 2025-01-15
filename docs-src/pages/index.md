# Nanogen

[![npm](https://img.shields.io/npm/v/nanogen.svg)](https://www.npmjs.com/package/nanogen)
[![Build Status](https://travis-ci.org/doug2k1/nanogen.svg?branch=cli)](https://travis-ci.org/doug2k1/nanogen)
[![Maintainability](https://api.codeclimate.com/v1/badges/ab96ad49962fca4a6f2e/maintainability)](https://codeclimate.com/github/doug2k1/nanogen/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ab96ad49962fca4a6f2e/test_coverage)](https://codeclimate.com/github/doug2k1/nanogen/test_coverage)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/doug2k1/nanogen-template)

Minimalist static site generator, powered by [Node.js](https://nodejs.org/en/)

## Features

* Generate HTML pages from [EJS](http://ejs.co/) and/or Markdown files.
* The site can have a global layout (the common header, navigation, footer) and some pages may have a specific one.
* It can read site metadata from a global file and have specific data for individual pages.
* Allow partials (blocks of reusable interface components)


## Getting started

### Prerequisites

* [Node.js](https://nodejs.org/en/) installed (version 8 or above)

### Install

You may install it globally with:

```
npm i -g nanogen
```

Or run the cli directly with npx (available with npm 5.2 or above):

```
npx nanogen <command>
```

### Creating a new site

To create a brand new site, navigate to the folder you want your site to be and run:

```
nanogen init
```

This will create a initial site structure like this:

```
/
  src/
    assets/
    layouts/
    pages/
    partials/
  site.config.js
```

To build the site and open it in a browser, run:

```
npm start
```

There is already a default layout inside the `layouts` folder, but you may add more.

Read more about [Layouts](docs/#layouts).

Inside the `pages` folder is where you put ejs, md or html files that will generate the pages of the final site. Any file name and folder structure used here will be transposed to the resulting site (without the `pages` part). 

Read more about [Pages](docs/#pages).

## Available commands and options

You may run `nanogen -h` to see the available commands and options:

```
  Initialize a new site:

    $ nanogen init

  Start the current site:

    $ nanogen start [options]

  Build the current site:

    $ nanogen build [options]

  Options
    -c, --config <file-path>  Path to the config file (default: site.config.js)
    -p, --port <port-number>  Port to use for local server (default: 3000)

    -h, --help                Display this help text
    -v, --version             Display Nanogen version
```

## Docs

[Read the full documentation](docs/)