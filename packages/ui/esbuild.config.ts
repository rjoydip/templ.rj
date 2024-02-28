import { argv } from 'node:process'
import * as esbuild from 'esbuild'
import type { BuildOptions } from 'esbuild'
import { getBuildConfig } from '@templ/config'
import { globby } from 'globby'

const entryPoints = await globby(['index.ts', 'components/**/*.{ts,tsx,js,jsx}', 'lib/**/*.ts', 'registry/**/*.{ts,tsx,js,jsx}'], {
  ignore: ['registry/**/*.stories.{ts,tsx,js,jsx}', 'registry/**/*.test.{ts,tsx,js,jsx}'],
})

const config: BuildOptions = {
  ...getBuildConfig({}),
  entryPoints,
}

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
