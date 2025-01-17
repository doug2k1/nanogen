import { log } from '@/libs/logger/logger'
import fse from 'fs-extra'
import { createSpinner } from 'nanospinner'
import cp from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import util from 'node:util'
import pc from 'picocolors'

const exec = util.promisify(cp.exec)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Initialize a new Nanogen site from a predefined template.
 */
export const init = async (templateDir = '../template') => {
  log.info('Initializing a new Nanogen site ...')

  // copy template files
  fse.copySync(path.resolve(__dirname, templateDir), '.')

  // install dependencies
  const spinner = createSpinner('Installing dependencies...').start()

  await exec('npm i --loglevel error')
  spinner.success()

  log.success(`Site initialized successfully!`)
  log.info(
    `Now you can run:
  ${pc.cyan('npm start')}      to start your new site, or
  ${pc.cyan('npm run build')}  to build it into the 'public' folder.`,
  )
}
