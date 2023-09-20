import type { Options } from 'tsup'
import type { BuildOptions, TemplOptions } from './schema'

const defaultBuildConfig: BuildOptions = {
  assets: [],
  exclude: [],
  include: [],
  clean: true,
  dts: true,
  minify: true,
  compile: 'esbuild',
  format: ['esm'],
}

const defaultTSupConfig: Options = {
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

const defaultTemplConfig: TemplOptions = {
  build: defaultBuildConfig,
  tsup: defaultTSupConfig
}

export default defaultTemplConfig
export { defaultTemplConfig }
