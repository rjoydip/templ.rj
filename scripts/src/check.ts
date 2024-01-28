import { resolve } from 'node:path'
import { cwd } from 'node:process'
import consola from 'consola'
import { globby } from 'globby'
import { ignorePatterns } from './utils'

export async function run() {
  const workingDirectories = await globby(['{packages,apps}/**/package.json'], {
    ignore: ignorePatterns,
    cwd: resolve(cwd(), '..'),
  })
  const files = await globby(['{packages,apps}/**/dist/index.js'], {
    ignore: ignorePatterns,
    cwd: resolve(cwd(), '..'),
  })

  files.length === workingDirectories.length ? consola.success('Dist count matched') : consola.error('Dist count not match')
}

run().catch(consola.error)
