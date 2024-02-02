import { rm } from 'node:fs/promises'
import { sep } from 'node:path'
import consola from 'consola'
import { colors } from 'consola/utils'
import { globby } from 'globby'
import { splitByCase } from 'scule'
import { hasDryRun, ignorePatterns, root } from '../utils'

export async function run() {
  const files = await globby(['**/.env'], {
    ignore: ignorePatterns,
    gitignore: false,
    absolute: true,
    cwd: root,
  })

  if (!hasDryRun()) {
    await Promise.all(
      files.map(async (f) => {
        await rm(f, {
          force: true,
        })
      }),
    )
    files.length ? consola.box(`Env file delete env file from \n\n${files.map(d => colors.magenta((splitByCase(d, ['\\', '/']) ?? []).slice(0, 4).join(sep))).join('\n')}`) : consola.error('No env file found')
  }
  else {
    consola.box(`Would be deleted env file from \n\n${files.map(d => colors.magenta((splitByCase(d, ['\\', '/']) ?? []).slice(0, 4).join(sep))).join('\n')}`)
  }
}

run().catch(consola.error)
