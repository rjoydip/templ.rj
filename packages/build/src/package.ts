#!/usr/bin/env tsx

import { rm, cp, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import mri from 'mri'
import { totalist } from 'totalist'
import { build, context, type BuildOptions } from 'esbuild'

const args = mri(process.argv.slice(2))
const watch = !!args.watch

const entryPoints: string[] = []
const assets: string[] = []

void(async () => {
  await totalist('./src', (rel) => {
    if (rel.endsWith('.ts') || rel.endsWith('.tsx')) {
      if (
        rel.includes('.test.') ||
        rel.includes('.stories.')
      ) {
        return
      }
      entryPoints.push(join('src', rel))
    }
    if (rel.endsWith('.json')) {
      assets.push(rel)
    }
  })

  await rm('dist', { recursive: true, force: true })
  // regenerate them so we can safely write files into those directories without relying on esbuild creating them
  // in the watch mode esbuild might not create them soon enough for them to be available for other parts of the script
  await mkdir('dist')

  await mkdir('dist/cjs')
  await mkdir('dist/esm')

  const cjsConfig: BuildOptions = {
    entryPoints,
    outdir: 'dist/cjs',
    format: 'cjs',
  }

  const esmConfig: BuildOptions = {
    entryPoints,
    outdir: 'dist/esm',
    format: 'esm',
  }

  if (watch) {
    const esmContext = await context(esmConfig)
    await esmContext.watch()
    const cjsContext = await context(cjsConfig)
    await cjsContext.watch()
  } else {
    await build(esmConfig)
    await build(cjsConfig)
  }

  await writeFile(
    'dist/cjs/package.json',
    JSON.stringify({ type: 'commonjs' }) + '\n',
    'utf8'
  )

  for (const rel of assets) {
    await cp(join('src', rel), join('dist/cjs', rel))
    await cp(join('src', rel), join('dist/esm', rel))
  }

  if (watch) {
    // eslint-disable-next-line no-console
    console.info('watching...')
  } else {
    // eslint-disable-next-line no-console
    console.info('build succeeded')
  }
})()

