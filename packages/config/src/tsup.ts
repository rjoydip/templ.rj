import type { Options } from 'tsup'

export const tsupDefaultConfig: Options = {
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  minify: true,
  target: 'esnext',
  format: ['esm'],
  platform: 'node',
}
