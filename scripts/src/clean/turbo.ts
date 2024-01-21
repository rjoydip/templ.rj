import { cwd, exit } from 'node:process'
import { join } from 'node:path'
import consola from 'consola'
import { deleteAsync } from 'del'
import { colors } from 'consola/utils'
import { hasDryRun, ignorePatterns } from '../utils'

async function main() {
  const deletedPaths = await deleteAsync(['**/.turbo/**'], {
    ignore: ignorePatterns,
    cwd: join(cwd(), '..'),
    dryRun: hasDryRun(),
    force: true,
    absolute: false,
    onlyDirectories: true,
  })

  deletedPaths.length ? consola.box(`Deleted turbo folders:\n\n${deletedPaths.map(d => colors.magenta(d)).join('\n')}`) : consola.info('No turbo folder deleted')
}

main().catch(consola.error).finally(() => exit(0))
