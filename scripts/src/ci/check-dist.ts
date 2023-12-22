import type { Stats } from 'node:fs'
import { intro, log } from '@clack/prompts'
import { totalist } from 'totalist'
import { getPackageRootAsync } from '../utils'

async function main() {
  let count = 0
  intro('Dist checking')

  const pkgRoot = await getPackageRootAsync()

  await totalist(pkgRoot, async (name: string, _, stats: Stats) => {
    if (/^([^\/\\]*)([\/\\]dist)([\/\\]index)\.js$/.test(name) && !stats.isSymbolicLink())
      count++
  })

  count === 5 ? log.success(`Dist count matched`) : log.error('Dist count not match')
}

main().catch(console.error)
