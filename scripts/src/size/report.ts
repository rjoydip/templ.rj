import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { totalist } from 'totalist'
import { intro, outro } from '@clack/prompts'
import { getPackageRootAsync, getPackagesAsync, getRootAsync } from '../utils'
import { renderReport } from './render'
import { generateData } from './data'

export interface Preset {
  name: string
  imports: string[] | string
  entry: string
}

async function main() {
  const root = await getRootAsync()
  const packages = await getPackagesAsync()
  const pkgRoot = await getPackageRootAsync()

  const tempDir = `${root}/temp`
  const currDir = `${root}/temp/size`
  const prevDir = `${root}/temp/size-prev`
  const reportFile = `${root}/size-report.md`

  intro('Size report generate')

  if (!existsSync(tempDir))
    await mkdir(tempDir)

  if (existsSync(currDir)) {
    await totalist(currDir, async (name: string, abs: string) => {
      if (/\.json$/.test(name))
        await cp(abs, resolve(prevDir, name), { force: true })
    })
  }
  else {
    await mkdir(currDir)
    await mkdir(prevDir)
  }

  const presets: Preset[] = packages.map(pkgName => ({
    name: pkgName,
    imports: '*',
    entry: resolve(pkgRoot, pkgName, 'dist', 'index.js'),
  }))

  const gData = await generateData(presets)

  await writeFile(
    resolve(currDir, '_packages.json'),
    JSON.stringify(gData, null, 4),
    'utf-8',
  )

  const reportData = await renderReport()
  await writeFile(reportFile, reportData)
  await readFile(reportFile, 'utf8')

  outro('All set')
}

main().catch(console.error)
