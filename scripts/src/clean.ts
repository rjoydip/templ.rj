import { argv } from 'node:process'
import { parse, sep } from 'node:path'
import { rm, rmdir } from 'node:fs/promises'
import { type Stats, existsSync } from 'node:fs'
import colors from 'picocolors'
import parser from 'yargs-parser'
import { log } from '@clack/prompts'
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

  const deletedPaths: string[] = []

  await totalist(root, async (name: string, abs: string, stats: Stats) => {
    if (!createRegExp(exactly('node_modules').or('.git').or('templates').or('fixtures').or('templ.code-workspace').or('templ.mjs')).test(name)) {
      if (name.match(createRegExp(exactly('dist').or('temp').or('coverage').or('turbo-build.log')))) {
        deletedPaths.push(abs)
        if (!dryRun) {
          if (stats.isFile()) {
            await rm(abs, {
              force: true,
              recursive: true,
            })
          }
        }
      }
    }
  })

  await Promise.all(
    deletedPaths.map(async (d) => {
      const dir = parse(d).dir
      if (existsSync(dir))
        await rmdir(dir, {})
    }),
  )

  log.message(deletedPaths.length ? getWrappedStr(`Deleted files and directories:\n\n${deletedPaths.map(d => colors.green(d.replace(createRegExp(exactly(`${root}${sep}`), []), ''))).join('\n')}`) : 'Nothing has been deleted')
}

main().catch(console.error)
