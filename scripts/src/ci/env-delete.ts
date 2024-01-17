import { argv, cwd } from 'node:process'
import { rm } from 'node:fs/promises'
import { join } from 'node:path'
import { log } from '@clack/prompts'
import colors from 'picocolors'
import { globby } from 'globby'
import parser from 'yargs-parser'
import { ignorePatterns } from '../utils'

async function main() {
  const {
    dryRun,
  } = parser(argv.slice(2), {
    configuration: {
      'boolean-negation': false,
    },
  })
  const files = await globby(['**/.env'], {
    ignore: ignorePatterns,
    gitignore: false,
    absolute: true,
    cwd: join(cwd(), '..'),
  })

  if (!dryRun) {
    await Promise.all(
      files.map(async (f) => {
        await rm(f, {
          force: true,
        })
      }),
    )
    files.length ? log.message(`Env file delete \n${files.map(d => colors.green(d)).join('\n')}`) : log.error('No env file found')
  }
  else {
    log.message(`Would be deleted \n${files.map(d => colors.green(d)).join('\n')}`)
  }
}

main().catch(console.error)
