import { join } from 'node:path'
import { cwd, exit } from 'node:process'
import consola from 'consola'
import { globby } from 'globby'
import { getPackagesAsync, ignorePatterns } from './utils'

async function main() {
  const packages = await getPackagesAsync()
  const files = await globby(['**/dist/index.js'], {
    ignore: ignorePatterns,
    cwd: join(cwd(), '..'),
  })

  files.length === packages.length ? consola.success('Dist count matched') : consola.error('Dist count not match')
}

main().catch(consola.error).finally(() => exit(0))
