import type { Stats } from 'node:fs'
import { existsSync } from 'node:fs'
import { dirname, sep } from 'node:path'
import { totalist } from 'totalist'
import { lint as typeCoverage } from 'type-coverage-core'
import tablemark from 'tablemark'
import { createRegExp, exactly } from 'magic-regexp'
import { getRootDirAsync } from '@templ/utils'
import { ignoreRegex } from '../utils'

export async function getTypeCoverageResults(): Promise<string> {
  const paths: string[] = []
  const root = await getRootDirAsync()

  await totalist(root, (name: string, abs: string, stats: Stats) => {
    if (!ignoreRegex.test(abs) && !stats.isSymbolicLink()) {
      const regex = createRegExp(exactly('tsconfig.json'), [])
      if (regex.test(name) && existsSync(abs))
        paths.push(dirname(abs))
    }
  })

  const results = await Promise.all(paths.map(async (p) => {
    const coverage = await typeCoverage(p, { strict: true })
    const percentage = (coverage.correctCount / coverage.totalCount) * 100
    return {
      path: p.replace(createRegExp(exactly(`${root}${sep}`), ['g']), ''),
      correctCount: coverage.correctCount,
      totalCount: coverage.totalCount,
      percentage: percentage > 0 ? Number((percentage).toFixed(2)) : 0,
    }
  }))

  return tablemark(results)
}
