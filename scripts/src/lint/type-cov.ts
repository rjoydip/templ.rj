import { resolve } from 'node:path'
import { cwd } from 'node:process'
import consola from 'consola'
import { globby } from 'globby'
import { splitByCase, upperFirst } from 'scule'
import { table } from 'table'
import { lint as typeCoverage } from 'type-coverage-core'
import { ignorePatterns } from '../utils'

interface TypeCoverage {
  path: string
  correctCount: number
  totalCount: number
  percentage: number
}

export async function typeCov(): Promise<TypeCoverage[]> {
  let paths: string[] = []
  const root = resolve(cwd(), '..')
  paths = await globby(['**/tsconfig.json'], {
    ignore: ignorePatterns,
    absolute: true,
    cwd: root,
  })
  consola.start('Collecting Type Coverage Results')
  const results = await Promise.all(paths.map(async (p) => {
    const splittedPath = splitByCase(p, ['\\', '/'])
    const path = splittedPath[6]?.endsWith('.json') ? splittedPath[5] : splittedPath[6]
    const coverage = await typeCoverage(p, { strict: true })
    const percentage = (coverage.correctCount / coverage.totalCount) * 100
    return {
      path: upperFirst(path ?? ''),
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

export async function run() {
  const results = await typeCov()
  typeCovRenderer(results)
}

run().catch(consola.error)
