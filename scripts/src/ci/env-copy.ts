import { cwd, exit } from 'node:process'
import { dirname, join } from 'node:path'
import { cp } from 'node:fs/promises'
import { consola } from 'consola'
import { globby } from 'globby'
import { colors } from 'consola/utils'
import { hasDryRun, ignorePatterns } from '../utils'

async function main() {
  const files = await globby(['**/.env.sample'], {
    ignore: ignorePatterns,
    gitignore: false,
    absolute: true,
    cwd: join(cwd(), '..'),
  })
  if (!hasDryRun()) {
    await Promise.all(
      files.map(async (f) => {
        await cp(f, join(dirname(f), '.env'), { force: true })
      }),
    )
    files.length ? consola.success(`Env copied`) : consola.error('No env file found')
  }
  else {
    consola.box(`Would be copied \n${files.map(d => colors.magenta(d)).join('\n')}`)
  }
}

main().catch(consola.error).finally(() => exit(0))
