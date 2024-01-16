import type { Stats } from 'node:fs'
import { existsSync } from 'node:fs'
import { argv } from 'node:process'
import { dirname, sep } from 'node:path'
import { totalist } from 'totalist'
import { lint as typeCoverage } from 'type-coverage-core'
import { createRegExp, exactly } from 'magic-regexp'
import parser from 'yargs-parser'
import { table } from 'table'
import { note } from '@clack/prompts'
import { getRootDirAsync, ignoreRegex } from '../utils'

interface TypeCoverage {
  path: string
  correctCount: number
  totalCount: number
  percentage: number
}

export async function typeCov(): Promise<TypeCoverage[]> {
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

  return results
}

const {
  dryRun,
} = parser(argv.slice(2), {
  configuration: {
    'boolean-negation': false,
  },
})

export function typeCovRenderer(results: TypeCoverage[]) {
  note(table([
    Object.keys(results[0] ?? {}),
    ...results.map(r => Object.values(r)),
  ]), 'Type Coverage')
}

if (dryRun) {
  (async () => {
    const results = await typeCov()
    typeCovRenderer(results)
  })()
}
