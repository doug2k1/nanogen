import pc from 'picocolors'

export const log = {
  info(message: string) {
    console.log(`${pc.gray('[nanogen]')} ${message}`)
  },

  success(message: string) {
    console.log(`${pc.gray('[nanogen]')} ${pc.green(message)}`)
  },

  error(message: string) {
    console.log(`${pc.gray('[nanogen]')} ${pc.red(message)}`)
  },
}
