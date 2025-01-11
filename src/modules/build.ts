import ejs from 'ejs'
import frontMatter from 'front-matter'
import fse from 'fs-extra'
import { glob } from 'glob'
import { marked } from 'marked'
import path from 'path'
import { log } from '../utils/logger'
import { parseOptions } from '../utils/parser'

/**
 * Build the site
 */
export const build = (options = {}) => {
  log.info('Building site...')
  const startTime = process.hrtime()
  const { srcPath, outputPath, cleanUrls, site } = parseOptions(options)

  console.log({ srcPath, outputPath, cleanUrls, site })

  // clear destination folder
  fse.emptyDirSync(outputPath)

  // copy assets folder
  if (fse.existsSync(`${srcPath}/assets`)) {
    fse.copySync(`${srcPath}/assets`, outputPath)
  }

  // read pages
  const files = glob.sync('**/*.@(md|ejs|html)', { cwd: `${srcPath}/pages` })

  files.forEach((file) =>
    _buildPage(file, { srcPath, outputPath, cleanUrls, site }),
  )

  // display build time
  const timeDiff = process.hrtime(startTime)
  const duration = timeDiff[0] * 1000 + timeDiff[1] / 1e6
  log.success(`Site built succesfully in ${duration}ms`)
}

/**
 * Loads a layout file
 */
interface LayoutConfig {
  srcPath: string
}

interface LayoutResult {
  file: string
  data: string
}

const _loadLayout = (
  layout: string,
  { srcPath }: LayoutConfig,
): LayoutResult => {
  const file = `${srcPath}/layouts/${layout}.ejs`
  const data = fse.readFileSync(file, 'utf-8')

  return { file, data }
}

/**
 * Build a single page
 */
interface PageConfig {
  srcPath: string
  outputPath: string
  cleanUrls: boolean
  site: any
}

interface PageAttributes {
  layout?: string
  [key: string]: any
}

interface PageData {
  attributes: PageAttributes
  body: string
}

interface TemplateConfig {
  site: any
  page: PageAttributes
}

const _buildPage = (
  file: string,
  { srcPath, outputPath, cleanUrls, site }: PageConfig,
): void => {
  const fileData = path.parse(file)
  let destPath = path.join(outputPath, fileData.dir)

  // create extra dir if generating clean URLs and filename is not index
  if (cleanUrls && fileData.name !== 'index') {
    destPath = path.join(destPath, fileData.name)
  }

  // create destination directory
  fse.mkdirsSync(destPath)

  // read page file
  const data = fse.readFileSync(`${srcPath}/pages/${file}`, 'utf-8')

  const pageData: PageData = frontMatter(data)
  const templateConfig: TemplateConfig = {
    site,
    page: pageData.attributes,
  }

  let pageContent: string
  const pageSlug = file.split(path.sep).join('-')

  // generate page content according to file type
  switch (fileData.ext) {
    case '.md':
      pageContent = marked.parse(pageData.body, { async: false })
      break
    case '.ejs':
      pageContent = ejs.render(pageData.body, templateConfig, {
        filename: `${srcPath}/page-${pageSlug}`,
      })
      break
    default:
      pageContent = pageData.body
  }

  // render layout with page contents
  const layoutName = pageData.attributes.layout || 'default'
  const layout = _loadLayout(layoutName, {
    srcPath,
  })

  const completePage = ejs.render(
    layout.data,
    Object.assign({}, templateConfig, {
      body: pageContent,
      filename: `${srcPath}/layout-${layoutName}`,
    }),
  )

  // save the html file
  if (cleanUrls) {
    fse.writeFileSync(`${destPath}/index.html`, completePage)
  } else {
    fse.writeFileSync(`${destPath}/${fileData.name}.html`, completePage)
  }
}
