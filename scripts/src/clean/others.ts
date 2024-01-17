import { argv, cwd } from 'node:process'
import { join } from 'node:path'
import { log } from '@clack/prompts'
import { deleteAsync } from 'del'
import colors from 'picocolors'
import parser from 'yargs-parser'
import { ignorePatterns } from '../utils'

async function main() {
  let deletedPaths: string[] = []
  const { dryRun = false } = parser(argv.splice(2), {
    configuration: {
      'boolean-negation': false,
    },
  })

  deletedPaths = await deleteAsync(['**/dist/**', '**/temp/**', '**/coverage/**'], {
    ignore: ignorePatterns,
    cwd: join(cwd(), '..'),
    dryRun,
    force: true,
    absolute: false,
  })

  log.message(deletedPaths.length ? `Deleted files and directories:\n\n${deletedPaths.map(d => colors.green(d)).join('\n')}` : 'Nothing has been deleted')
}

main().catch(console.error)
