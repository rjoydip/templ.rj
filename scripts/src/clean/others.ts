import { cwd } from 'node:process'
import { resolve, sep } from 'node:path'
import consola from 'consola'
import { colors } from 'consola/utils'
import { deleteAsync } from 'del'
import { splitByCase } from 'scule'
import { hasDryRun, ignorePatterns } from '../utils'

export async function run() {
  let deletedPaths: string[] = []

  deletedPaths = await deleteAsync(['**/dist/**', '**/temp/**', '**/coverage/**'], {
    ignore: ignorePatterns,
    cwd: resolve(cwd(), '..'),
    dryRun: hasDryRun(),
    force: true,
    absolute: false,
  })

  deletedPaths.length
    ? consola.box(`Deleted files and directories:\n\n${deletedPaths.map((d) => {
  const splitedPath = splitByCase(d, ['\\', '/'])
  const l = splitedPath.length
  const p = splitedPath.slice(l - 3, l - 1)
  return colors.magenta(p.join(sep))
}).join('\n')}`)
    : consola.info('Nothing has been deleted')
}

run().catch(consola.error)
