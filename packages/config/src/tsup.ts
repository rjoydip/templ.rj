import type { Options } from 'tsup'
import { configCreator } from './configCreator'

/* The code is defining a default configuration object for the `tsup` bundler. */
export const defaultConfig: Options = {
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

export const tsupConfig = configCreator</**
 * any on configCreator to avoid error "The inferred type of 'tsup' cannot
 * be named without a reference to '.../node_modules/tsup'. This is likely not
 * portable. A type annotation is necessary."
 */
any>(defaultConfig)
