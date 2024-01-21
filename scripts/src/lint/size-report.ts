import { join, parse, resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { cp, mkdir, readdir, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { platform } from 'node:os'
import { promisify } from 'node:util'
import { brotliCompress, gzip } from 'node:zlib'
import { cwd, exit } from 'node:process'
import consola from 'consola'
import { table } from 'table'
import { globby } from 'globby'
import { rollup } from 'rollup'
import { minify } from 'terser'
import { getPackagesAsync, prettyBytes } from '../utils'

export interface Preset {
  name: string
  imports: string[] | string
  entry: string
}

interface SizeResult {
  size: number
  gzip: number
  brotli: number
}

interface BundleResult extends SizeResult {
  file: string
}

type PackageResult = Record<string, SizeResult & { name: string }>

const artifacts = join(cwd(), '..', 'artifacts')
const currDir = resolve(artifacts, 'temp/size')
const prevDir = resolve(artifacts, 'temp/size-prev')

const sizeHeaders = ['Size', 'Gzip', 'Brotli']

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
  } from '${platform() === 'win32' ? preset.entry.replace(/\\/g, '\\\\') : preset.entry}'`

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

async function importJSON<T>(path: string): Promise<T | undefined> {
  if (!existsSync(path))
    return undefined
  return (await import(platform() === 'win32' ? pathToFileURL(path).href : path, { assert: { type: 'json' } })).default
}

function getDiff(curr: number, prev?: number) {
  if (prev === undefined)
    return ''
  const diff = curr - prev
  if (diff === 0)
    return ''
  const sign = diff > 0 ? '+' : ''
  return ` (**${sign ?? '-'}${prettyBytes(diff) ?? 0}**)`
}

export async function renderBundles() {
  const filterFiles = (files: string[]) => files.filter(file => !file.startsWith('_'))

  const curr = filterFiles(await readdir(currDir))
  const prev = existsSync(prevDir) ? filterFiles(await readdir(prevDir)) : []
  const fileList = [...curr, ...prev]

  const rows: string[][] = []
  for (const file of fileList) {
    const currPath = resolve(currDir, file)
    const prevPath = resolve(prevDir, file)

    const curr = await importJSON<BundleResult>(currPath)
    const prev = await importJSON<BundleResult>(prevPath)
    const fileName = curr?.file || prev?.file || ''

    if (!curr) {
      rows.push([`~~${fileName}~~`])
    }
    else {
      rows.push([
        fileName,
        `${prettyBytes(curr.size)}${getDiff(curr.size, prev?.size)}`,
        `${prettyBytes(curr.gzip)}${getDiff(curr.gzip, prev?.gzip)}`,
        `${prettyBytes(curr.brotli)}${getDiff(curr.brotli, prev?.brotli)}`,
      ])
    }
  }

  return [['Bundles', '', '', ''], ['Entry', ...sizeHeaders], ...rows]
}

export async function renderPackages() {
  const curr = (await importJSON<PackageResult>(
    resolve(currDir, '_packages.json'),
  )) || {}
  const prev = await importJSON<PackageResult>(
    resolve(prevDir, '_packages.json'),
  )

  const data = Object.values(curr)
    .map((usage) => {
      const prevUsage = prev?.[usage.name]
      const diffSize = getDiff(usage.size, prevUsage?.size)
      const diffGzipped = getDiff(usage.gzip, prevUsage?.gzip)
      const diffBrotli = getDiff(usage.brotli, prevUsage?.brotli)

      return [
        usage.name,
        `${prettyBytes(usage.size)}${diffSize}`,
        `${prettyBytes(usage.gzip)}${diffGzipped}`,
        `${prettyBytes(usage.brotli)}${diffBrotli}`,
      ]
    })
    .filter((usage): usage is string[] => !!usage)

  return [['Paclages', '', '', ''], ['Name', ...sizeHeaders], ...data]
}

export async function sizeReportRenderer(dir: string = cwd()) {
  const packages = await getPackagesAsync()
  const artifacts = dir

  const tempDir = `${artifacts}/temp`
  const currDir = `${artifacts}/temp/size`
  const prevDir = `${artifacts}/temp/size-prev`

  if (!existsSync(tempDir)) {
    await mkdir(tempDir, {
      recursive: true,
    })
  }

  if (existsSync(currDir)) {
    const dirs = await globby(['*.json'], {
      cwd: currDir,
      absolute: true,
      gitignore: false,
    })

    await Promise.all(
      dirs.map(async (d) => {
        const { name, ext } = parse(d)
        await cp(d, resolve(prevDir, `${name}.${ext}`), { force: true })
      }),
    )
  }
  else {
    await mkdir(currDir, {
      recursive: true,
    })
    await mkdir(prevDir, {
      recursive: true,
    })
  }

  const presets: Preset[] = packages.map(pkgName => ({
    name: pkgName,
    imports: '*',
    entry: resolve(cwd(), '..', pkgName, 'dist', 'index.js'),
  }))

  const gData = await generateData(presets)

  await writeFile(
    resolve(currDir, '_packages.json'),
    JSON.stringify(gData, null, 4),
    'utf-8',
  )

  const bundles = await renderBundles()
  const pacakges = await renderPackages()

  let output = ''

  output += table(bundles, {
    columns: [
      { alignment: 'center', width: 8 },
    ],
    spanningCells: [
      { col: 0, row: 0, colSpan: 4 },
    ],
  })

  output += '\n'

  output += table(pacakges, {
    columns: [
      { alignment: 'center', width: 8 },
    ],
    spanningCells: [
      { col: 0, row: 0, colSpan: 4 },
    ],
  })

  consola.box(output)
}

async function main() {
  await sizeReportRenderer(join(cwd(), '..', 'artifacts'))
}

main().catch(consola.error).finally(() => exit(0))
