// Copied from https://github.com/toeverything/blocksuite/blob/master/scripts/size-data.ts

import { resolve } from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { brotliCompress, gzip } from 'node:zlib'
import { rollup } from 'rollup'
import { minify } from 'terser'

import { pkgRoot, root } from '../utils'

const gzipAsync = promisify(gzip)
const brotliAsync = promisify(brotliCompress)

const sizeDir = resolve(root, 'temp/size')

interface Preset {
  name: string
  imports: string[] | string
  pkg: string
  entry: string
}

const presets: Preset[] = [
  /* {
    name: 'build',
    imports: '*',
    pkg: resolve(pkgRoot, 'build'),
    entry: 'dist/index.js',
  },
  {
    name: 'cli',
    imports: '*',
    pkg: resolve(pkgRoot, 'cli'),
    entry: 'dist/index.js',
  },
  {
    name: 'config',
    imports: '*',
    pkg: resolve(pkgRoot, 'config'),
    entry: 'dist/index.js',
  },
  {
    name: 'core',
    imports: '*',
    pkg: resolve(pkgRoot, 'core'),
    entry: 'dist/index.js',
  },
  {
    name: 'logger',
    imports: '*',
    pkg: resolve(pkgRoot, 'logger'),
    entry: 'dist/index.js',
  }, */
  {
    name: 'utils',
    imports: '*',
    pkg: resolve(pkgRoot, 'utils'),
    entry: 'dist/index.js',
  },
]

const tasks: ReturnType<typeof generateBundle>[] = []
for (const preset of presets) {
  tasks.push(generateBundle(preset))
}

const results = Object.fromEntries(
  (await Promise.all(tasks)).map(r => [r.name, r])
)

await mkdir(sizeDir, { recursive: true })
await writeFile(
  resolve(sizeDir, '_packages.json'),
  JSON.stringify(results),
  'utf-8'
)

async function generateBundle(preset: Preset) {
  const entry = resolve(preset.pkg, preset.entry)
  const id = 'virtual:entry'
  const content = `export ${
    typeof preset.imports === 'string'
    ? preset.imports
      : `{ ${preset.imports.join(', ')} }`
  } from '${entry}'`

  const result = await rollup({
    input: id,
    plugins: [
      {
        name: 'size-data-plugin',
        resolveId(_id) {
          if (_id === id) return id
          return null
        },
        load(_id) {
          if (_id === id) return content
          return null
        },
      },
    ],
    logLevel: 'debug',
  })

  const generated = await result.generate({
    inlineDynamicImports: true,
  })
  const bundled = generated.output[0].code
  const minified = (
    await minify(bundled, {
      module: true,
      toplevel: true,
    })
  ).code!

  const size = minified.length
  const gzip = (await gzipAsync(minified)).length
  const brotli = (await brotliAsync(minified)).length

  return {
    name: preset.name,
    size,
    gzip,
    brotli,
  }
}
