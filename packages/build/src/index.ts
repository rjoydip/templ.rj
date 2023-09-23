import { join, resolve } from 'node:path'
import { mkdir, rm } from 'node:fs/promises'
import { getTsconfig } from 'get-tsconfig'
import { totalist } from 'totalist'
import { createLogger } from '@templ/logger'
import type { BuildOptions as ESBuildOptions } from 'esbuild'
import type { BuildOptions, Format, NonBuildOptions } from '@templ/config'
import { dTSPlugin } from './plugin/dts'
import esbuild from './_esbuild'

export async function build(options: BuildOptions) {
  const plugins = []
  const logger = createLogger()

  await totalist(`./${options.srcDir}`, (rel) => {
    if (rel.endsWith('.ts') || rel.endsWith('.tsx')) {
      if (rel.includes('.test.') || rel.includes('.stories.'))
        return

      options.include.push(join(options.srcDir, rel))
    }
    if (rel.endsWith('.json'))
      options.assets.push(rel)
  })

  if (options.clean) {
    logger.info('CLI', 'Cleaning output folder')
    await rm(options.outDir, { recursive: true, force: true })
  }
  // regenerate them so we can safely write files into those directories without relying on esbuild creating them
  // in the watch mode esbuild might not create them soon enough for them to be available for other parts of the script
  await mkdir(options.outDir)

  const tsconfigData = getTsconfig(resolve(options.tsconfig || './'))

  if (options.dts) {
    plugins.push(dTSPlugin({
      debug: options.debug,
      outDir: options.outDir,
      tsconfig: options.tsconfig,
    }))
  }

  const target = options.target || tsconfigData?.config?.compilerOptions?.target
  const outdir = options.outDir || tsconfigData?.config?.compilerOptions?.outDir
  const outfile = outdir ? '' : options.outFile

  const buildOptions: ESBuildOptions = {
    bundle: options.bundle,
    entryPoints: options.include,
    outdir,
    outfile,
    minify: options.minify,
    plugins,
    target,
    splitting: false,
  }

  const nonBuildOptions: NonBuildOptions = {
    srcDir: options.srcDir,
    watch: options.watch,
    assets: options.assets,
    clean: false,
    bundler: 'esbuild',
    debug: false,
    dts: false,
    exclude: [],
    include: [],
    tsconfig: '',
  }

  await Promise.all([
    ...options.format.map(async (format: string) => {
      const startTime = Date.now()
      logger.info(format, 'Build start')
      const _outDir = options.format.length > 1 ? `${options.outDir}/${format}` : options.outDir
      await mkdir(_outDir, { recursive: true })
      if (options.bundler === 'esbuild') {
        await esbuild({
          ...buildOptions,
          format: format as Format,
          outdir: _outDir,
        }, nonBuildOptions)
        const timeInMs = Date.now() - startTime
        logger.success(format, `⚡️ Build success in ${Math.floor(timeInMs)}ms`)
      }
      else {
        // TODO
        return Promise.resolve()
      }
    }),
  ])
}
