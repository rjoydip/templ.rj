// Copied from https://github.com/toeverything/blocksuite/blob/master/scripts/size-data.ts

import { promisify } from 'node:util'
import { brotliCompress, gzip } from 'node:zlib'
import { platform } from 'node:os'
import { sep } from 'node:path'
import { rollup } from 'rollup'
import { minify } from 'terser'
import { createRegExp, exactly } from 'magic-regexp'
import type { Preset } from './report'

const gzipAsync = promisify(gzip)
const brotliAsync = promisify(brotliCompress)

const tasks: ReturnType<typeof generateBundle>[] = []

export async function generateData(presets: Preset[]) {
  for (const preset of presets)
    tasks.push(generateBundle(preset))

  const results = Object.fromEntries(
    (await Promise.all(tasks)).map(r => [r.name, r]),
  )
  return results
}

async function generateBundle(preset: Preset) {
  const id = 'virtual:entry'
  const content = `export ${
    typeof preset.imports === 'string'
      ? preset.imports
      : `{ ${preset.imports.join(', ')} }`
  } from '${platform() === 'win32' ? preset.entry.replace(createRegExp(exactly(sep), ['g']), '\\\\') : preset.entry}'`

  const result = await rollup({
    input: id,
    plugins: [
      {
        name: 'size-data-plugin',
        resolveId(_id) {
          if (_id === id)
            return id
          return null
        },
        load(_id) {
          if (_id === id)
            return content
          return null
        },
      },
    ],
    logLevel: 'silent',
  })

  const generated = await result.generate({
    inlineDynamicImports: true,
  })

  const minified = (
    await minify(generated.output[0].code, {
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
