import { cwd } from 'node:process'
import { resolve } from 'node:path'
import consola from 'consola'
import { deleteAsync } from 'del'
import { colors } from 'consola/utils'
import { splitByCase, upperFirst } from 'scule'
import { hasDryRun, ignorePatterns } from '../utils'

export async function run() {
  const deletedPaths = await deleteAsync(['**/.turbo/**'], {
    ignore: ignorePatterns,
    cwd: resolve(cwd(), '..'),
    dryRun: hasDryRun(),
    force: true,
    absolute: false,
    onlyDirectories: true,
  })

  deletedPaths.length
    ? consola.box(`Deleted turbo folders:\n\n${deletedPaths.map((d) => {
    const splitedPath = splitByCase(d, ['\\', '/'])
    const l = splitedPath.length
    const p = splitedPath.slice(l - 2, l - 1)
    return colors.magenta(upperFirst(p.join(' ')))
  }).join('\n')}`)
    : consola.info('No turbo folder deleted')
}

run().catch(consola.error)
