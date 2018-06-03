# nanogen

[![npm](https://img.shields.io/npm/v/nanogen.svg)](https://www.npmjs.com/package/nanogen)
[![Build Status](https://travis-ci.org/doug2k1/nanogen.svg?branch=cli)](https://travis-ci.org/doug2k1/nanogen)
[![Maintainability](https://api.codeclimate.com/v1/badges/ab96ad49962fca4a6f2e/maintainability)](https://codeclimate.com/github/doug2k1/nanogen/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ab96ad49962fca4a6f2e/test_coverage)](https://codeclimate.com/github/doug2k1/nanogen/test_coverage)

Minimalist static site generator, powered by [Node.js](https://nodejs.org/en/)

## Features

* Generate HTML pages from [EJS](http://ejs.co/) and/or Markdown files.
* The site can have a global layout (the common header, navigation, footer) and some pages may have a specific one.
* It can read site metadata from a global file and have specific data for individual pages.
* Allow partials (blocks of reusable interface components)


## Getting started

### Prerequisites

* [Node.js](https://nodejs.org/en/) installed (6.0.0 or above)

### Install

```
npm i -g nanogen
```

Or run the cli directly with npx (available with npm 5.2 or above):

```
npx nanogen
```

### Zero-config

nanogen can work without a configuration file, as long as your files are organized in the following folder structure:

```
/
  src/
    layouts/
      default.ejs
    pages/
      ... (ejs, md or html files)
```

You must have a default layout in `src/layouts/default.ejs`, and this file must have a `<%- body %>` tag to indicate where the pages content should go.

Read more about [Layouts](#layouts).

Inside the `pages` folder is where you put ejs, md or html files that will generate the pages of the final site. Any file name and folder structure used here will be transposed to the resulting site. E.g.:

| source folder               | resulting site      |
|-----------------------------|---------------------|
| src/pages/index.ejs         | /index.html         |
| src/pages/about.md          | /about.html         |
| src/pages/projects/page.ejs | /projects/page.html |

Read more about [Pages](#pages).

To build the site run on the command line:

```
nanogen
```

The resulting site will be generated at the `/public` folder by default.

**Note:** the output folder will be clean and regenerated on every build. Do not put files there directly.

## Docs

[Read the full documentation](docs)