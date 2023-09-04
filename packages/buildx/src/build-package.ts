#!/usr/bin/env tsx

import { join } from 'node:path'
import { rm, mkdir } from 'node:fs/promises'
import mri from 'mri'
import { totalist } from 'totalist'
import type { EsbuildFormat } from './esbuild'
import esbuild from './esbuild'

void(async () => {
  const assets: string[] = []
  const entryPoints: string[] = []
  const args = mri(process.argv.slice(2))
  const watch: boolean = !!args.watch || false
  const clean: boolean = !!args.clean || true
  const srcDir: string = args.src || 'src'
  const outDir: string = args.out || 'dist'
  const formats: EsbuildFormat[] = args.format.includes(',') ? args.format.split(',') : [args.format] ?? ['esm']

  await totalist(`./${srcDir}`, (rel) => {
    if (rel.endsWith('.ts') || rel.endsWith('.tsx')) {
      if (
        rel.includes('.test.') ||
        rel.includes('.stories.')
      ) {
        return
      }
      entryPoints.push(join(srcDir, rel))
    }
    if (rel.endsWith('.json')) {
      assets.push(rel)
    }
  })

  if (clean) await rm(outDir, { recursive: true, force: true })

  // regenerate them so we can safely write files into those directories without relying on esbuild creating them
  // in the watch mode esbuild might not create them soon enough for them to be available for other parts of the script
  await mkdir(outDir)

  if (formats.length === 1) {
    esbuild({
      entryPoints,
      format: formats[0],
      outdir: outDir,
      srcDir,
      watch,
      assets
    })
  } else {
    for (const format of formats) {
      const _outDir = `${outDir}/${format}`
      await mkdir(_outDir)
      esbuild({
        entryPoints,
        format: format,
        outdir: _outDir,
        srcDir,
        watch,
        assets
      })
    }
  }
})()

