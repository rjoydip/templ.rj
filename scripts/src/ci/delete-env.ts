import { rm } from 'node:fs/promises'
import type { Stats } from 'node:fs'
import { totalist } from 'totalist'
import { intro, log } from '@clack/prompts'
import { getPackageRootAsync } from '../utils'

async function main() {
  let count = 0
  intro('CI env delete')

  const pkgRoot = await getPackageRootAsync()

  await totalist(pkgRoot, async (name: string, abs: string, stats: Stats) => {
    if (!/node_modules|test|dist|coverage/.test(abs) && !stats.isSymbolicLink()) {
      if (/\.env$/.test(name)) {
        count++
        await rm(abs)
      }
    }
  })

  count ? log.success(`Env file delete`) : log.error('No env file found')
}

main().catch(console.error)
