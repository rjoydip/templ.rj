import { rm } from 'node:fs/promises'
import type { Stats } from 'node:fs'
import { totalist } from 'totalist'
import { intro, log } from '@clack/prompts'
import { createRegExp, exactly } from 'magic-regexp'
import { getPackagesDirAsync } from '@templ/utils'
import { ignoreRegex } from '../utils'

async function main() {
  let count = 0
  intro('CI env delete')

  const pkgRoot = await getPackagesDirAsync()

  await totalist(pkgRoot, async (name: string, abs: string, stats: Stats) => {
    if (!ignoreRegex.test(abs) && !stats.isSymbolicLink()) {
      const regex = createRegExp(exactly('.env'), [])
      if (regex.test(name)) {
        count++
        await rm(abs)
      }
    }
  })

  count ? log.success(`Env file delete`) : log.error('No env file found')
}

main().catch(console.error)
