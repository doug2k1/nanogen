import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/cli.ts', 'src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  format: 'esm',
})
