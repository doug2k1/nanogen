import chalk from 'chalk'

export const log = {
  info(message: string) {
    console.log(`${chalk.gray('[nanogen]')} ${message}`)
  },

  success(message: string) {
    console.log(`${chalk.gray('[nanogen]')} ${chalk.green(message)}`)
  },

  error(message: string) {
    console.log(`${chalk.gray('[nanogen]')} ${chalk.red(message)}`)
  },
}
