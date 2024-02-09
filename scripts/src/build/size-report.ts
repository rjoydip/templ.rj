import { parse, resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { cp, mkdir, readdir, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { platform } from 'node:os'
import { promisify } from 'node:util'
import { brotliCompress, gzip } from 'node:zlib'
import { cwd } from 'node:process'
import consola from 'consola'
import { table } from 'table'
import { globby } from 'globby'
import { rollup } from 'rollup'
import { splitByCase, upperFirst } from 'scule'
import { minify } from 'terser'
import { getPackagesAsync, prettyBytes, root } from '../utils'

export interface Preset {
  name: string
  imports: string[] | string
  entry: string
}

interface SizeResult {
  name: string
  size: number
  gzip: number
  brotli: number
}

interface BundleResult extends SizeResult {
  file: string
}

type PackageResult = Record<string, SizeResult & { name: string }>

const currDir = resolve(root, 'artifacts', 'temp/size')
const prevDir = resolve(root, 'artifacts', 'temp/size-prev')

const sizeHeaders = ['Size', 'Gzip', 'Brotli']

const gzipAsync = promisify(gzip)
const brotliAsync = promisify(brotliCompress)

const tasks: ReturnType<typeof generateBundle>[] = []
/**
 * Asynchronously generates data based on the given presets.
 *
 * @param {Preset[]} presets - an array of presets
 * @return {Promise<{[k: string]: {name: string; size: number; gzip: number; brotli: number;}}>} a promise that resolves to an object containing the generated data
 */
export async function generateData(presets: Preset[]): Promise<{
  [k: string]: SizeResult
}> {
  for (const preset of presets)
    tasks.push(generateBundle(preset))

  const results = Object.fromEntries(
    (await Promise.all(tasks)).map(r => [r.name, r]),
  )
  return results
}
/**
 * Async function to generate a bundle based on the given preset.
 *
 * @param {Preset} preset - the preset object used to generate the bundle
 * @return {Promise<{ name: string, size: number, gzip: number, brotli: number }>} an object containing the name, size, gzip, and brotli of the generated bundle
 */
async function generateBundle(preset: Preset): Promise<{
  name: string
  size: number
  gzip: number
  brotli: number
}> {
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
/**
 * Asynchronously imports a JSON file from the specified path.
 *
 * @param {string} path - The path to the JSON file.
 * @return {Promise<T | undefined>} The imported JSON data, or undefined if the file does not exist.
 */
async function importJSON<T>(path: string): Promise<T | undefined> {
  if (!existsSync(path))
    return undefined
  return (await import(platform() === 'win32' ? pathToFileURL(path).href : path, { assert: { type: 'json' } })).default
}
/**
 * Calculates the difference between the current and previous number and returns a formatted string indicating the sign and magnitude of the difference.
 *
 * @param {number} curr - The current number
 * @param {number} [prev] - The previous number (optional)
 * @return {string} formatted string indicating the sign and magnitude of the difference
 */
function getDiff(curr: number, prev?: number): string {
  if (prev === undefined)
    return ''
  const diff = curr - prev
  if (diff === 0)
    return ''
  const sign = diff > 0 ? '+' : ''
  return ` (**${sign ?? '-'}${prettyBytes(diff) ?? 0}**)`
}
/**
 * Renders the bundles and returns a 2D array containing information about the bundles.
 *
 * @return {Promise<string[][]>} a 2D array containing information about the bundles
 */
export async function renderBundles(): Promise<string[][]> {
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
/**
 * Render the packages and return a 2D array containing package data.
 *
 * @return {Promise<string[][]>} 2D array containing package data
 */
export async function renderPackages(): Promise<string[][]> {
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

  return [['Packages', '', '', ''], ['Name', ...sizeHeaders], ...data]
}
/**
 * This function renders a size report for the given directory.
 *
 * @param {string} dir - the directory to render the report for (default: resolved 'artifacts' directory)
 * @return {Promise<void>} a promise that resolves when the size report has been rendered
 */
export async function sizeReportRenderer(dir: string = resolve(root, 'artifacts')): Promise<void> {
  const packages = await getPackagesAsync()

  const tempDir = `${dir}/temp`
  const currDir = `${dir}/temp/size`
  const prevDir = `${dir}/temp/size-prev`

  if (!existsSync(tempDir)) {
    await mkdir(tempDir, {
      recursive: true,
    })
  }

  if (existsSync(currDir)) {
    const dirs = await globby(['**/*.json'], {
      cwd: currDir,
      absolute: true,
      gitignore: false,
    })

    await Promise.all(
      dirs.map(async (d) => {
        const { name, ext } = parse(d)
        await cp(d, resolve(prevDir, `${name}.${ext}`), { force: true, recursive: true })
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

  const presets: Preset[] = packages.map(p => ({
    name: upperFirst(
      splitByCase(p, ['\\', '/'])[1] ?? '',
    ),
    imports: '*',
    entry: resolve(cwd(), '..', p),
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
/**
 * Run the function asynchronously and await the size report renderer.
 *
 * @returns {Promise<void>} A promise that resolves when the function completes execution.
 */
export async function run(): Promise<void> {
  await sizeReportRenderer()
}

run().catch(consola.error)
