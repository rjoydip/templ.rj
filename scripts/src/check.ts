import { resolve } from 'node:path'
import { cwd } from 'node:process'
import consola from 'consola'
import { globby } from 'globby'
import { getPackagesAsync, ignorePatterns } from './utils'

export async function run() {
  const packages = await getPackagesAsync()
  const files = await globby(['**/dist/index.js'], {
    ignore: ignorePatterns,
    cwd: resolve(cwd(), '..'),
  })

  files.length === packages.length ? consola.success('Dist count matched') : consola.error('Dist count not match')
}

run().catch(consola.error)
