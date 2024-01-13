import { cp } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type { Stats } from 'node:fs'
import { existsSync } from 'node:fs'
import { intro, log } from '@clack/prompts'
import { totalist } from 'totalist'
import { createRegExp, exactly } from 'magic-regexp'
import { getPackagesDirAsync, ignoreRegex } from '../utils'

async function main() {
  let count = 0

  intro('CI env coping')

  const pkgRoot = await getPackagesDirAsync()

  await totalist(pkgRoot, async (name: string, abs: string, stats: Stats) => {
    if (!ignoreRegex.test(abs) && !stats.isSymbolicLink()) {
      const regex = createRegExp(exactly('.env.sample'), [])
      if (regex.test(name) && existsSync(abs)) {
        count++
        await cp(abs, join(dirname(abs), '.env'), { force: true })
      }
    }
  })

  count ? log.success(`Env copied`) : log.error('No env file found')
}

main().catch(console.error)
