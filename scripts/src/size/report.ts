import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { totalist } from 'totalist'
import { intro, outro } from '@clack/prompts'
import { getArtifactsDirAsync, getPackagesAsync, getPackagesDirAsync } from '../utils'
import { renderReport } from './render'
import { generateData } from './data'

export interface Preset {
  name: string
  imports: string[] | string
  entry: string
}

async function main() {
  const packages = await getPackagesAsync()
  const pkgRoot = await getPackagesDirAsync()
  const artifacts = await getArtifactsDirAsync()

  const tempDir = `${artifacts}/temp`
  const currDir = `${artifacts}/temp/size`
  const prevDir = `${artifacts}/temp/size-prev`
  const reportFile = `${artifacts}/size-report.md`

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
