import { lint as typeCoverage } from 'type-coverage-core'
import { getRootDirAsync, ignorePatterns } from '@templ/utils'
import { table } from 'table'
import { note } from '@clack/prompts'
import { globby } from 'globby'

interface TypeCoverage {
  path: string
  correctCount: number
  totalCount: number
  percentage: number
}

export async function typeCov(): Promise<TypeCoverage[]> {
  let paths: string[] = []
  const root = await getRootDirAsync()

  paths = await globby(['**/tsconfig.json'], {
    ignore: ignorePatterns,
    gitignore: false,
    absolute: true,
    cwd: root,
  })

  const results = await Promise.all(paths.map(async (p) => {
    const coverage = await typeCoverage(p, { strict: true })
    const percentage = (coverage.correctCount / coverage.totalCount) * 100
    return {
      path: p,
      correctCount: coverage.correctCount,
      totalCount: coverage.totalCount,
      percentage: percentage > 0 ? Number((percentage).toFixed(2)) : 0,
    }
  }))

  return results
}

export function typeCovRenderer(results: TypeCoverage[]) {
  note(table([
    Object.keys(results[0] ?? {}),
    ...results.map(r => Object.values(r)),
  ]), 'Type Coverage')
}

async function main() {
  const results = await typeCov()
  typeCovRenderer(results)
}

main().catch(console.error)
