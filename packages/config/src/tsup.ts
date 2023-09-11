import type { Options } from 'tsup'

const tsupConfig: Options = {
  entry: ['./src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  minify: true,
  target: 'esnext',
  format: ['esm'],
  platform: 'node',
}

export { tsupConfig }
