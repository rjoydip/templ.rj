import { argv } from 'node:process'
import * as esbuild from 'esbuild'
import type { BuildOptions } from 'esbuild'
import { getBuildConfig } from '@templ/config'

const config: BuildOptions = getBuildConfig({})

async function run() {
  if (argv.slice(2).includes('--watch')) {
    const ctx = await esbuild.context(config)
    await ctx.watch()
  }
  else {
    await esbuild.build(config)
  }
}

run()
