import { argv } from 'node:process'
import { sep } from 'node:path'
import { rmdir } from 'node:fs/promises'
import colors from 'picocolors'
import parser from 'yargs-parser'
import { intro, log, outro } from '@clack/prompts'
import { createRegExp, exactly } from 'magic-regexp'
import { totalist } from 'totalist'
import { getRootDirAsync, getWrappedStr } from './utils'

async function main() {
  const root = await getRootDirAsync()
  const { dryRun = false } = parser(argv.splice(2), {
    configuration: {
      'boolean-negation': false,
    },
  })

  intro('Clean')

  const deletedPaths: string[] = []

  await totalist(root, async (name: string) => {
    if (!createRegExp(exactly('node_modules').or('.git').or('templates').or('fixtures').or('templ.code-workspace').or('templ.mjs')).test(name)) {
      if (name.match(createRegExp(exactly('dist').or('temp').or('coverage')))) {
        deletedPaths.push(
          name.replace(createRegExp(exactly(`${root}${sep}`), []), ''),
        )
        if (!dryRun)
          await rmdir(name)
      }
    }
  })

  log.message(deletedPaths.length ? getWrappedStr(`Deleted files and directories:\n\n${deletedPaths.map(d => colors.green(d)).join('\n')}`) : 'Nothing has been deleted')

  outro('All set')
}

main().catch(console.error)
