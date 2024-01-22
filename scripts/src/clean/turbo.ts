import { cwd } from 'node:process'
import { resolve } from 'node:path'
import consola from 'consola'
import { deleteAsync } from 'del'
import { colors } from 'consola/utils'
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

  deletedPaths.length ? consola.box(`Deleted turbo folders:\n\n${deletedPaths.map(d => colors.magenta(d)).join('\n')}`) : consola.info('No turbo folder deleted')
}

run().catch(consola.error)
