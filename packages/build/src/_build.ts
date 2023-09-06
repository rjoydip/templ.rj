import { mkdir, rm } from 'node:fs/promises'
import esbuild from './_esbuild'
import type { BuildOptions, Format } from './types'

export async function build(options: BuildOptions) {
  if (options.clean) await rm(options.outDir, { recursive: true, force: true })

  // regenerate them so we can safely write files into those directories without relying on esbuild creating them
  // in the watch mode esbuild might not create them soon enough for them to be available for other parts of the script
  await mkdir(options.outDir)

  if (options.format.length === 1) {
    await esbuild({
      entryPoints: options.includes,
      format: options.format[0] as Format,
      outdir: options.outDir,
      minify: options.minify
    }, {
      srcDir: options.srcDir,
      watch: options.watch,
      assets: options.assets
    })
  } else {
    for (const format of options.format) {
      const _outDir = `${options.outDir}/${format}`
      await mkdir(_outDir)
      await esbuild({
        entryPoints: options.includes,
        format: format as Format,
        outdir: _outDir,
        minify: options.minify
      }, {
        srcDir: options.srcDir,
        watch: options.watch,
        assets: options.assets
      })
    }
  }
}
