import { argv } from 'node:process'
import { log } from '@clack/prompts'
import { deleteAsync } from 'del'
import colors from 'picocolors'
import parser from 'yargs-parser'
import { getRootDirAsync, getWrappedStr, ignorePatterns, patterns } from '@templ/utils'

async function main() {
  let deletedPaths: string[] = []
  const root = await getRootDirAsync()
  const { dryRun = false } = parser(argv.splice(2), {
    configuration: {
      'boolean-negation': false,
    },
  })

  deletedPaths = await deleteAsync(patterns, {
    ignore: ignorePatterns,
    cwd: root,
    dryRun,
    force: true,
    absolute: false,
  })

  log.message(deletedPaths.length ? getWrappedStr(`Deleted files and directories:\n\n${deletedPaths.map(d => colors.green(d)).join('\n')}`) : 'Nothing has been deleted')
}

main().catch(console.error)
