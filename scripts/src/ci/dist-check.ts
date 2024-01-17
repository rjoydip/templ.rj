import { log } from '@clack/prompts'
import { getRootDirAsync } from '@templ/utils'
import { globby } from 'globby'

async function main() {
  const root = await getRootDirAsync()
  const files = await globby(['**/dist/index.js'], {
    cwd: root,
  })
  files.length === 5 ? log.success('Dist count matched') : log.error('Dist count not match')
}

main().catch(console.error)
