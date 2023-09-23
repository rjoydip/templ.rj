import type { BuildOptions, TemplOptions } from './schema'

const defaultBuildConfig: BuildOptions = {
  assets: [],
  exclude: [],
  include: [],
  clean: true,
  dts: true,
  minify: true,
  bundler: 'esbuild',
  format: ['esm'],
}

const defaultTemplConfig: TemplOptions = {
  build: defaultBuildConfig,
}

export default defaultTemplConfig
export { defaultTemplConfig }
