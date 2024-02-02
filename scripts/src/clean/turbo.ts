import { sep } from 'node:path'
import consola from 'consola'
import { deleteAsync } from 'del'
import { colors } from 'consola/utils'
import { splitByCase } from 'scule'
import { hasDryRun, ignorePatterns, root } from '../utils'

export async function run() {
  const deletedPaths = await deleteAsync(['**/.turbo/**'], {
    ignore: ignorePatterns,
    cwd: root,
    dryRun: hasDryRun(),
    force: true,
    absolute: false,
    onlyDirectories: true,
  })

  deletedPaths.length
    ? consola.box(`Deleted turbo folders:\n\n${deletedPaths.map((d) => {
    const splitedPath = splitByCase(d, ['\\', '/'])
    const l = splitedPath.length
    const p = splitedPath.slice(l - 3, l - 1)
    return colors.magenta(p.join(sep))
  }).join('\n')}`)
    : consola.info('No turbo folder deleted')
}

run().catch(consola.error)
