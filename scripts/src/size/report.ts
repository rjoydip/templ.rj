import { resolve } from 'node:path'
import { argv } from 'node:process'
import { existsSync } from 'node:fs'
import { cp, mkdir, writeFile } from 'node:fs/promises'
import { totalist } from 'totalist'
import { createRegExp, exactly } from 'magic-regexp'
import parser from 'yargs-parser'
import { note } from '@clack/prompts'
import { table } from 'table'
import { getArtifactsDirAsync, getPackagesAsync, getPackagesDirAsync } from '../utils'
import { renderBundles, renderPackages } from './render'
import { generateData } from './data'

export interface Preset {
  name: string
  imports: string[] | string
  entry: string
}

export async function sizeReportRenderer() {
  const packages = await getPackagesAsync()
  const pkgRoot = await getPackagesDirAsync()
  const artifacts = await getArtifactsDirAsync()

  const tempDir = `${artifacts}/temp`
  const currDir = `${artifacts}/temp/size`
  const prevDir = `${artifacts}/temp/size-prev`

  if (!existsSync(tempDir)) {
    await mkdir(tempDir, {
      recursive: true,
    })
  }

  if (existsSync(currDir)) {
    const regex = createRegExp(exactly('.json'), ['g'])
    await totalist(currDir, async (name: string, abs: string) => {
      if (regex.test(name))
        await cp(abs, resolve(prevDir, name), { force: true })
    })
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
    entry: resolve(pkgRoot, pkgName, 'dist', 'index.js'),
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

  note(output, 'Size Report')
}

const {
  dryRun,
} = parser(argv.slice(2), {
  configuration: {
    'boolean-negation': false,
  },
})

if (dryRun) {
  (async () => {
    await sizeReportRenderer()
  })()
}
