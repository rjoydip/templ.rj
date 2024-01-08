import type { Stats } from 'node:fs'
import { existsSync } from 'node:fs'
import { dirname, sep } from 'node:path'
import { getRootAsync } from 'src/utils'
import { totalist } from 'totalist'
import { lint as typeCoverage } from 'type-coverage-core'
import tablemark from 'tablemark'

export async function getTypeCoverageResults(): Promise<string> {
  const paths: string[] = []
  const root = await getRootAsync()

  await totalist(root, (name: string, abs: string, stats: Stats) => {
    if (!/node_modules|test|dist|coverage|templates/.test(abs) && !stats.isSymbolicLink()) {
      if (/\\tsconfig.json$/.test(name) && existsSync(abs))
        paths.push(dirname(abs))
    }
  })

  const results = await Promise.all(paths.map(async (p) => {
    const coverage = await typeCoverage(p, { strict: true })
    const percentage = (coverage.correctCount / coverage.totalCount) * 100
    return {
      path: p.replace(`${root}${sep}`, ''),
      correctCount: coverage.correctCount,
      totalCount: coverage.totalCount,
      percentage: percentage > 0 ? Number((percentage).toFixed(2)) : 0,
    }
  }))

  return tablemark(results)
}
