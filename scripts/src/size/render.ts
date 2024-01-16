// Copied from https://github.com/toeverything/blocksuite/blob/master/scripts/size-report.ts

import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { platform } from 'node:os'
import { getArtifactsDirSync, prettyBytes } from '../utils'

interface SizeResult {
  size: number
  gzip: number
  brotli: number
}

interface BundleResult extends SizeResult {
  file: string
}

type PackageResult = Record<string, SizeResult & { name: string }>

const artifacts = getArtifactsDirSync()
const currDir = resolve(artifacts, 'temp/size')
const prevDir = resolve(artifacts, 'temp/size-prev')

const sizeHeaders = ['Size', 'Gzip', 'Brotli']

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
