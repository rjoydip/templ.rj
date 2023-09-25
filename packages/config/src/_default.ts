import type { BuildOptions, TemplOptions } from './schema'

const defaultBuildConfig: BuildOptions = {
  assets: [],
  exclude: [],
  include: [],
  format: [],
  clean: true,
  dts: true,
  minify: true,
  bundler: 'esbuild',
  debug: false,
  srcDir: '',
  tsconfig: '',
  watch: false,
  bundle: false,
  outDir: '',
  outFile: '',
  target: '',
}

export const defaultTemplConfig: TemplOptions = {
  build: defaultBuildConfig,
}
