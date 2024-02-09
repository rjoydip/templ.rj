/* v8 ignore start */
import { argv } from 'node:process'
import * as esbuild from 'esbuild'
import { getBuildConfig } from '@templ/config'

const config = getBuildConfig()

if (argv.slice(2).includes('--watch')) {
  const ctx = await esbuild.context(config)
  await ctx.watch()
}
else {
  await esbuild.build(config)
}
/* c8 ignore end */
