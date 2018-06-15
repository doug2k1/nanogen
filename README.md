# Nanogen

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

Nanogen can work without a configuration file, as long as your files are organized in the following folder structure:

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

Inside the `pages` folder is where you put ejs, md or html files that will generate the pages of the final site. Any file name and folder structure used here will be transposed to the resulting site (without the `pages` part). 

Read more about [Pages](#pages).

To build the site run on the command line:

```
nanogen
```

The resulting site will be generated at the `/public` folder by default.

**Note:** the output folder will be clean and regenerated on every build. Do not put files there directly.

## Watch mode

Run with the flag `-w` to enter watch mode. 

```
nanogen -w
```

The site will generated and served on a local server at http://localhost:3000. Any file modification will trigger a site rebuild automatically and the browser page will be refreshed.

You can change the server port with the `-p` flag:

```
nanogen -w -p 5000
```

## Configuration

You can change the source and destination folders with a configuration file. By default, that file should be named `site.config.js`.

Example config file:

```javascript
module.exports = {
  build: {
    srcPath: './site-source',
    outputPath: './site-destination'
  }
};
```

If you want to use a different file name, it will have to be supplied to the `nanogen` command:

```
nanogen my-config.js
```

### Site metadata

The configuration file can have a `site` entry, with additional data to be used in your pages:

```javascript
module.exports = {
  build: {
    srcPath: './src',
    outputPath: './public'
  },
  site: {
    title: 'My Awesome Site',
    author: 'Mary Jane'
  }
};
```

This data can be used inside the layout files or any EJS page. For example, the site title could be displayed in the header of the default layout:

```html
<html>
  <head>
    <title><%= site.title %></title>
  </head>
  <body>
    <%- body %>
  </body>
</html>
```

### Page specific metadata (front matter)

You can also have additional data on individual pages, in [YAML](http://yaml.org/start.html) format, like this:

```yaml
---
title: My First Post
date: 2018-06-01
tags:
  - games
  - stuff
  - tips
---
Contents of the page goes here...
```

Make sure this data is at the top of the page, separated by `---`. This block of page data is usually refered as **front matter**.

This data can also be used inside the layout, with the `page` prefix:

```html
<h1><%= page.title %></h1>
<p>By <%= page.author %></p>
<div>
  <% if (page.tags) { %>
    <% page.tags.forEach(function(tag) { %>
      <span><%= tag %></span>
    <% }) %>
  <% } %>
</div>
```

## Layouts

Layouts are EJS files that hold the common parts of all pages, like header, navigation, footer.

Every layout must have a `<%- body %>` tag to indicate where the page contents will be inserted. An minimalist layout example would be:

```html
<html>
  <head>
    <title>My Site</title>
  </head>
  <body>
    <%- body %>
  </body>
</html>
```

The default layout is located at `layouts/default.ejs` in the source folder.

### Multiple layouts

Your site can have more than one layout. Each page that uses a different layout, should indicate that in the **front matter**, like this:

```yaml
---
layout: minimal
---
Page contents
```

The page above would be created with the layout file located at `layouts/minimal.ejs`.

## Pages

The files that will generate the pages of your site must be located at the `pages` folder. Inside that folder you can have any number of `.ejs`, `.md` or `.html` files, and any number of sub folders. Each source file will generate a resulting html file, with the same folder structure, combining the layout structure with the page contents.

An extra folder will be created at the destination with the name of the original file (without extension) and the resulting page will be saved as `index.html` inside that folder, except when the name of the original file is already `index`. This simplify the URLs of the final site.

Examples:

| source folder               | resulting site       | URL to the page   |
|-----------------------------|----------------------|-------------------|
| src/pages/index.ejs         | /index.html          | site.com          |
| src/pages/about.md          | /about/index.html    | site.com/about    |
| src/pages/projects.ejs      | /projects/index.html | site.com/projects |

## Partials

You can put reusable blocks of interface components in separate EJS files, and the import that files inside your layout or pages (only on EJS pages), like this:

```
<%- include('partials/head') %>
```

This will take the contents of the file `partials/head.ejs` and insert at that location. The file extension can be omitted in the `include` call.

Note that the path to the partial file is relative to the source folder, no matter the location of the layout or page that is including it. In short, it always start with `partials/...`.

## Assets

Your site probably will have other kinds of static files like CSS, JS and images. If you put those files inside the `assets` folder, they will be copied over to the output folder, maintaining the original file names and folder structure.

## Authors

* **Douglas Matoso** - *Initial work* - [doug2k1](https://github.com/doug2k1)

See also the list of [contributors](https://github.com/doug2k1/nanogen/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
