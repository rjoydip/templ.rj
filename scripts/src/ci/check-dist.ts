import type { Stats } from 'node:fs'
import { log } from '@clack/prompts'
import { totalist } from 'totalist'
import { getPackagesDirAsync } from '../utils'

async function main() {
  let count = 0
  const pkgRoot = await getPackagesDirAsync()

  await totalist(pkgRoot, async (name: string, _, stats: Stats) => {
    if (/^([^\/\\]*)([\/\\]dist)([\/\\]index)\.js$/.test(name) && !stats.isSymbolicLink())
      count++
  })

  count === 5 ? log.success('Dist count matched') : log.error('Dist count not match')
}

main().catch(console.error)
