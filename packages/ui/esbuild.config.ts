/* v8 ignore start */
import { argv } from 'node:process'
import * as esbuild from 'esbuild'
import type { BuildOptions } from 'esbuild'
import { getBuildConfig } from '@templ/config'
import { globby } from 'globby'

const entryPoints = await globby(['index.ts', 'components/**/*.{ts,tsx}', 'lib/**/*.ts', 'registry/**/*.{ts,tsx}'], {
  ignore: ['registry/**/*.stories.tsx'],
})

const config: BuildOptions = {
  ...getBuildConfig(),
  entryPoints,
}

if (argv.slice(2).includes('--watch')) {
  const ctx = await esbuild.context(config)
  await ctx.watch()
}
else {
  await esbuild.build(config)
}
/* v8 ignore end */
