import { log } from '@/libs/logger/logger'
import chalk from 'chalk'
import fse from 'fs-extra'
import cp from 'node:child_process'
import path from 'node:path'
import util from 'node:util'
import ora from 'ora'

const exec = util.promisify(cp.exec)

/**
 * Initialize a new Nanogen site from a predefined template.
 */
export const init = async () => {
  log.info('Initializing a new Nanogen site ...')

  // copy template files
  fse.copySync(path.resolve(__dirname, '../../../template'), '.')
  await exec('npm init -y')

  // add scripts to package.json
  const packageJSON = await import(path.relative(__dirname, './package.json'))

  fse.writeFileSync(
    './package.json',
    JSON.stringify(
      {
        ...packageJSON.default,
        script: {
          start: 'nanogen start',
          build: 'nanogen build',
        },
      },
      null,
      2,
    ),
  )

  // install nanogen
  const spinner = ora('Installing dependencies...').start()

  await exec('npm i -D nanogen --loglevel error')
  spinner.succeed()

  log.success(`Site initialized successfully!`)
  log.info(
    chalk`Now you can run:
  ${chalk.cyan('npm start')}      to start your new site, or
  ${chalk.cyan('npm run build')}  to build it into the 'public' folder.`,
  )
}
