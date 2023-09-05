import { join } from 'node:path'
import { cp, writeFile } from 'node:fs/promises'
import { defu } from 'defu'
import type { Format, BuildOptions } from 'esbuild'
import { build, context } from 'esbuild'
import { excludeKeys, includeKeys } from '@templ/utils'

export type EsbuildFormat = Format
export type EsbuildOptions = BuildOptions

interface NonBuildOptions {
  srcDir: string
  watch: boolean
  assets: string[]
}

const defaults: BuildOptions = {
  entryPoints: [],
  format: 'esm',
  outdir: 'dist',
  plugins: [],
}

async function esbuild(options: BuildOptions & NonBuildOptions) {
  const excludeKeysArray = ['watch', 'srcDir', 'assets']

  const buildOptions = excludeKeys<BuildOptions>(
    defu(options, defaults),
    (key: string) => excludeKeysArray.includes(key),
  )
  const nonBuildOptions = includeKeys<NonBuildOptions>(options, (key: string) =>
    excludeKeysArray.includes(key),
  )

  if (nonBuildOptions.watch) {
    const _context = await context(buildOptions)
    await _context.watch()
  } else {
    await build(buildOptions)
  }

  if (buildOptions.format.toLocaleLowerCase() === 'cjs')
    await writeFile(
      `${buildOptions.outdir}/package.json`,
      JSON.stringify({ type: 'commonjs' }) + '\n',
      'utf8',
    )

  for (const rel of nonBuildOptions.assets) {
    await cp(join(nonBuildOptions.srcDir, rel), join(buildOptions.outdir, rel))
  }

  if (nonBuildOptions.watch) {
    // eslint-disable-next-line no-console
    console.info('watching...')
  } else {
    // eslint-disable-next-line no-console
    console.info('build succeeded')
  }
}

export default esbuild
