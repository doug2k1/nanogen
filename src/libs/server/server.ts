import liveServer from 'live-server'

export const server = {
  serve({ path, port, open }: { path: string; port?: number; open?: boolean }) {
    liveServer.start({
      port,
      root: path,
      open,
      logLevel: 0,
    })
  },
}
