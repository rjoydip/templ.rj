#!/usr/bin/env tsx

import { join } from 'node:path'
import mri from 'mri'
import { totalist } from 'totalist'
import { build } from './_build'
import type { BuildOptions } from './types'
import { BuildOptionSchema } from './schema'

void (async () => {
  const assets: string[] = []
  const includes: string[] = []
  const args = mri(process.argv.slice(2), {
    default: {
      clean: true,
      dts: true,
      format: 'esm',
      minify: true,
      outDir: 'dist',
      srcDir: 'src',
      type: 'esbuild',
      watch: false
    }
  })

  const options: BuildOptions = BuildOptionSchema.parse({
    clean: args.clean,
    dts: args.dts,
    format: args.format.indexOf(',') !== -1 ? args.format.split(',') : [args.format],
    minify: args.minify,
    outDir: args.out,
    srcDir: args.src,
    type: args.type,
    watch: args.watch,
  })

  await totalist(`./${options.srcDir}`, (rel) => {
    if (rel.endsWith('.ts') || rel.endsWith('.tsx')) {
      if (rel.includes('.test.') || rel.includes('.stories.')) {
        return
      }
      includes.push(join(options.srcDir, rel))
    }
    if (rel.endsWith('.json')) {
      assets.push(rel)
    }
  })

  await build({
    includes,
    assets,
    ...options,
  })
})()
