import consola from 'consola'
import { globby } from 'globby'
import { root } from '../utils'

export async function run() {
  const cwd = root
  const ignorePatterns = ['.git/**', '**/node_modules/**', '**/tsconfig/**']
  const workingDirectories = await globby(['{packages,apps,plugins}/**/package.json'], {
    ignore: ignorePatterns,
    cwd,
  })
  const files = await globby(['{packages,apps,plugins}/**/dist/index.{js,html}', '{packages,apps,plugins}/**/.next/package.json'], {
    ignore: ignorePatterns,
    cwd,
  })

  files.length === workingDirectories.length ? consola.success('Build output count matched') : consola.error('Build output count not match')
}

run().catch(consola.error)
