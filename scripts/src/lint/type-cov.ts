import { join } from 'node:path'
import { cwd } from 'node:process'
import { lint as typeCoverage } from 'type-coverage-core'
import { table } from 'table'
import { consola } from 'consola'
import { globby } from 'globby'
import { ignorePatterns } from '../utils'

interface TypeCoverage {
  path: string
  correctCount: number
  totalCount: number
  percentage: number
}

export async function typeCov(): Promise<TypeCoverage[]> {
  let paths: string[] = []

  paths = await globby(['**/tsconfig.json'], {
    ignore: ignorePatterns,
    absolute: true,
    cwd: join(cwd(), '..'),
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
  consola.box(table([
    Object.keys(results[0] ?? {}),
    ...results.map(r => Object.values(r)),
  ]))
}

async function main() {
  const results = await typeCov()
  typeCovRenderer(results)
}

main().catch(consola.error)
