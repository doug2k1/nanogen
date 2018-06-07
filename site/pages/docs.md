# Docs

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

The default layout is located at `laouts/default.ejs` in the source folder.

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
<%- include('../partials/head') %>
```

This will take the contents of the file `partials/head.ejs` and insert at that location. The file extension can be omitted in the `include` call.

It's not mandatory, but we recommend puting your partials in the `partials` folder. 

## Assets

Your site probably will have other kinds of static files like CSS, JS and images. If you put those files inside the `assets` folder, they will be copied over to the output folder, maintaining the original file names and folder structure.