#!/usr/bin/env tsx

import sade from 'sade'
import mri from 'mri'
import { createLogger } from '@templ/logger'
import { version, name } from '../package.json'
import { BuildOptionSchema } from './schema'
import type { BuildOptions } from './types'
import { build } from './'

const prog = sade(name)

prog
  .version(version)
  .command('build')
  .describe('')
  .option('-o, --out-dir <dir>', 'Change the name of the output directory', 'dist')
  .option('--clean', 'Clean output directory', true)
  .option('--silent', 'Suppress non-error logs (excluding "onSuccess" process output)', false)
  .option('--compile', 'Compile type "esbuild", "rollup"', 'esbuild')
  .option('--dts', 'Generate declaration file', true)
  .option('--bundle', 'Bundle file', false)
  .option('--format [format]', 'Bundle format, "cjs", "iife", "esm"', 'cjs')
  .option('--minify', 'Minify bundle', true)
  .option('-s, --src-dir <dir>', 'Source/Entry directory', 'src')
  .option('--tsconfig <filename>', 'Use a custom tsconfig', 'tsconfig.json')
  .option('--watch', 'Enable watch mode', false)
  .example('build -d <dir>')
  .action(async (opts) => {
    const logger = createLogger()

    const options: BuildOptions = await BuildOptionSchema.parseAsync({
      assets: [],
      bundle: opts.bundle,
      clean: opts.clean,
      compile: opts.compile,
      debug: opts.silent,
      dts: opts.dts,
      exclude: [],
      format: opts.format.indexOf(',') !== -1 ? opts.format.split(',') : [opts.format],
      include: [],
      minify: opts.minify,
      outDir: opts.o,
      outFile: '',
      srcDir: opts.s,
      tsconfig: opts.tsconfig,
      watch: opts.watch,
      logger
    })

    if (!opts.silent) logger.info('CLI', `${name} v${version}`)
    await build(options)
  })

prog.parse(process.argv)
