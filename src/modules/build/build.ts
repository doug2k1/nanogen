import { parseOptions } from '@/libs/config/parser'
import { log } from '@/libs/logger/logger'
import ejs from 'ejs'
import frontMatter from 'front-matter'
import fse from 'fs-extra'
import { glob } from 'glob'
import { marked } from 'marked'
import path from 'node:path'
import { hrtime } from 'node:process'
import prettier from 'prettier'
import prettierConfig from '~/.prettierrc.json'

const WS_CLIENT_SCRIPT = `
<script>
  (function() {
    const ws = new WebSocket(\`ws://\${location.host}\`);
    ws.onmessage = () => location.reload();
  })();
</script>
</body>`

/**
 * Build the site
 */
export const build = (options = {}, mode = process.env.NODE_ENV || 'production') => {
  log.info('Building site...')
  const startTime = hrtime.bigint()
  const { srcPath, outputPath, cleanUrls, site } = parseOptions(options)

  // clear destination folder
  fse.emptyDirSync(outputPath)

  // copy assets folder
  if (fse.existsSync(path.join(srcPath, 'assets'))) {
    fse.copySync(path.join(srcPath, 'assets'), outputPath)
  }

  // read pages
  const files = glob.sync('**/*.@(md|ejs|html)', { cwd: path.join(srcPath, 'pages') })

  files.forEach((file) => {
    _buildPage(file, { srcPath, outputPath, cleanUrls, site }, mode)
  })

  // display build time
  const timeDiff = hrtime.bigint() - startTime
  const duration = Number(timeDiff) / 1e6
  log.success(`Site built successfully in ${duration.toFixed(2)} ms`)
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

const _loadLayout = (layout: string, { srcPath }: LayoutConfig): LayoutResult => {
  const file = path.join(srcPath, 'layouts', `${layout}.ejs`)
  const data = fse.readFileSync(file, 'utf-8')
  return { file, data }
}

/**
 * Format HTML content with Prettier
 */
const _formatHtml = async (html: string): Promise<string> => {
  try {
    return await prettier.format(html, {
      ...prettierConfig,
      parser: 'html',
    })
  } catch (error) {
    log.error(`Error formatting HTML with Prettier: ${error}`)
    return html // Return original if formatting fails
  }
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
  mode: string,
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
  const data = fse.readFileSync(path.join(srcPath, 'pages', file), 'utf-8')

  const pageData: PageData = frontMatter<PageAttributes>(data)
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
        filename: path.join(srcPath, `page-${pageSlug}`),
      })
      break
    default:
      pageContent = pageData.body
  }

  // render layout with page contents
  const layoutName = pageData.attributes.layout || 'default'
  const layout = _loadLayout(layoutName, { srcPath })

  let completePage = ejs.render(
    layout.data,
    { ...templateConfig, body: pageContent },
    { filename: path.join(srcPath, `layout-${layoutName}`) },
  )

  if (mode !== 'production') {
    // Inject WebSocket client script for live reload
    completePage = completePage.includes('</body>')
      ? completePage.replace('</body>', WS_CLIENT_SCRIPT)
      : completePage + WS_CLIENT_SCRIPT
  }

  // format and save the html file
  _formatHtml(completePage)
    .then((finalPage) => {
      const outputFile = cleanUrls
        ? path.join(destPath, 'index.html')
        : path.join(destPath, `${fileData.name}.html`)
      fse.writeFileSync(outputFile, finalPage)
    })
    .catch((error) => {
      log.error(`Failed to format and write page "${file}": ${error}`)
    })
}
