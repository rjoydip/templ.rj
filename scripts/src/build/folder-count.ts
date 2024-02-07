import consola from 'consola'
import { globby } from 'globby'
import { root } from '../utils'

export async function run() {
  const cwd = root
  const ignorePatterns = ['.git/**', '**/node_modules/**', '*templ.mjs', '*.code-workspace']
  const workingDirectories = await globby(['{packages,apps,plugins}/**/package.json'], {
    ignore: ignorePatterns,
    cwd,
  })
  const files = await globby(['{packages,apps,plugins}/**/dist/index.{js,html}'], {
    ignore: ignorePatterns,
    cwd,
  })

  files.length === workingDirectories.length ? consola.success('Dist count matched') : consola.error('Dist count not match')
}

run().catch(consola.error)
