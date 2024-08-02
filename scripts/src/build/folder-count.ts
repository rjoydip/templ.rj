import consola from 'consola'
import { globby } from 'globby'
import { root } from '../utils'

export async function run() {
  const cwd = root
  const ignorePatterns = ['.git', '**/node_modules', '**/tsconfig', '**/ui']
  const workingDirectories = await globby(['{packages,apps}/**/package.json'], {
    ignore: ignorePatterns,
    cwd,
  })
  const files = await globby(['{packages,apps}/**/dist/index.{js,html}', '{packages,apps}/**/.next/package.json'], {
    ignore: ignorePatterns,
    cwd,
  })

  if (files.length === workingDirectories.length)
    consola.success('Build output count matched')
  else
    consola.error('Build output count not match')
}

run().catch(consola.error)
