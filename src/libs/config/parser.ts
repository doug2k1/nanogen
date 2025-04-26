const buildDefaults = {
  srcPath: './src',
  outputPath: './public',
  cleanUrls: true,
}

/**
 * Parse options, setting the defaults on missing values
 */
interface BuildOptions {
  srcPath: string
  outputPath: string
  cleanUrls: boolean
}

interface SiteOptions {
  [key: string]: any
}

export interface Options {
  build?: Partial<BuildOptions>
  site?: SiteOptions
}

export const parseOptions = (options: Options): BuildOptions & { site: SiteOptions } => {
  const { srcPath, outputPath, cleanUrls } = Object.assign({}, buildDefaults, options.build)
  const site = options.site || {}

  return { srcPath, outputPath, cleanUrls, site }
}
