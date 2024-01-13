import { argv } from 'node:process'
import { sep } from 'node:path'
import colors from 'picocolors'
import { deleteAsync } from 'del'
import parser from 'yargs-parser'
import { intro, log, outro } from '@clack/prompts'
import { createRegExp, exactly } from 'magic-regexp'
import { getRootDirAsync, getWrappedStr } from './utils'

async function main() {
  const root = await getRootDirAsync()
  const { dryRun = false } = parser(argv.splice(2), {
    configuration: {
      'boolean-negation': false,
    },
  })

  intro('Clean')

  const deletedPaths = await deleteAsync(['**/dist', '**/coverage', 'docs/.vitepress'], {
    ignore: ['node_modules'],
    cwd: root,
    dryRun,
  })

  log.message(getWrappedStr(`Deleted files and directories:\n\n${deletedPaths.map(d => colors.green(d.replace(createRegExp(exactly(`${root}${sep}`), ['g', 'm']), ''))).join('\n')}`))

  outro('All set')
}

main().catch(console.error)
