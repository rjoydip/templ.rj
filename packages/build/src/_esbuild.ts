import { join } from 'node:path'
import { cp, writeFile } from 'node:fs/promises'
import { build as _build, context } from 'esbuild'
import type { BuildOptions } from 'esbuild'
import type { NonBuildOptions } from '@templ/config'

export default async function esbuild(buildOptions: BuildOptions, nonBuildOptions: NonBuildOptions) {
  const logger = nonBuildOptions.logger

  if (nonBuildOptions.watch) {
    const _context = await context(buildOptions)
    await _context.watch()
  } else {
    await _build(buildOptions)
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
    logger.info('CLI', 'Running in watch mode')
  }
}
