import { sep } from 'node:path'
import consola from 'consola'
import { colors } from 'consola/utils'
import { deleteAsync } from 'del'
import { splitByCase } from 'scule'
import { hasDryRun, ignorePatterns, root } from './utils'

export async function run() {
  let deletedPaths: string[] = []

  deletedPaths = await deleteAsync(['**/.next/**', '**/.turbo/**', '**/dist/**', '**/temp/**', '**/coverage/**'], {
    ignore: ignorePatterns,
    cwd: root,
    dryRun: hasDryRun(),
    force: true,
    absolute: false,
  })

  if (deletedPaths.length) {
    consola.box(`Deleted files and directories:\n\n${deletedPaths.map((d) => {
      const splitedPath = splitByCase(d, ['\\', '/'])
      const l = splitedPath.length
      const p = splitedPath.slice(l - 4, l - 1)
      return colors.magenta(p.join(sep))
    }).join('\n')}`)
  }
  else {
    consola.info('Nothing has been deleted')
  }
}

run().catch(consola.error)
