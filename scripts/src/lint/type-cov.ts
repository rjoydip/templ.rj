import { parse } from 'node:path'
import consola from 'consola'
import { globby } from 'globby'
import { splitByCase, upperFirst } from 'scule'
import { table } from 'table'
import { lint as typeCoverage } from 'type-coverage-core'
import { ignorePatterns, root } from '../utils'

export async function run() {
  const paths = await globby(['**/tsconfig.json'], {
    ignore: ignorePatterns,
    absolute: true,
    cwd: root,
  })
  consola.start('Collecting Type Coverage Results')
  const results = await Promise.all((paths).map(async (p) => {
    const splittedPath = splitByCase(p, ['\\', '/'])
    const path = splittedPath[6]?.endsWith('.json') ? splittedPath[5] : splittedPath[6]
    const coverage = await typeCoverage(parse(p).dir, { strict: true, notOnlyInCWD: true })
    const percentage = (coverage.correctCount / coverage.totalCount) * 100
    return {
      path: path?.split('-').map(i => upperFirst(i)).join(' '),
      correctCount: coverage.correctCount,
      totalCount: coverage.totalCount,
      percentage: percentage > 0 ? Number((percentage).toFixed(2)) : 0,
    }
  }))
  consola.box(table([
    Object.keys(results[0] ?? {}).map(i => upperFirst(i)),
    ...results.map(r => Object.values(r)),
  ]))
}

run().catch(consola.error)
