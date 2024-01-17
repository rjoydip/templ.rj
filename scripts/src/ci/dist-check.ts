import { join } from 'node:path'
import { cwd } from 'node:process'
import { log } from '@clack/prompts'
import { globby } from 'globby'

async function main() {
  const files = await globby(['**/dist/index.js'], {
    cwd: join(cwd(), '..'),
  })
  files.length === 5 ? log.success('Dist count matched') : log.error('Dist count not match')
}

main().catch(console.error)
