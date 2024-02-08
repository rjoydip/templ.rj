/* v8 ignore start */
import { argv } from 'node:process'
import * as esbuild from 'esbuild'
import type { BuildOptions } from 'esbuild'
import { clean, dts } from './src'

const config: BuildOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: false,
  treeShaking: true,
  target: ['node20'],
  packages: 'external',
  format: 'esm',
  outfile: 'dist/index.js',
  plugins: [clean(), dts()],
}

if (argv.slice(2).includes('--watch')) {
  const ctx = await esbuild.context(config)
  await ctx.watch()
}
else {
  await esbuild.build(config)
}
/* v8 ignore end */
