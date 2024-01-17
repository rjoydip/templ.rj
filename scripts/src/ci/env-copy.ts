import { argv, cwd } from 'node:process'
import { dirname, join } from 'node:path'
import { cp } from 'node:fs/promises'
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

  const files = await globby(['**/.env.sample'], {
    ignore: ignorePatterns,
    gitignore: false,
    absolute: true,
    cwd: join(cwd(), '..'),
  })
  if (!dryRun) {
    await Promise.all(
      files.map(async (f) => {
        await cp(f, join(dirname(f), '.env'), { force: true })
      }),
    )
    files.length ? log.success(`Env copied`) : log.error('No env file found')
  }
  else {
    log.message(`Would be copied \n${files.map(d => colors.green(d)).join('\n')}`)
  }
}

main().catch(console.error)
