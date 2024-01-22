import { cwd } from 'node:process'
import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import consola from 'consola'
import { globby } from 'globby'
import { colors } from 'consola/utils'
import { hasDryRun, ignorePatterns } from '../utils'

export async function run() {
  const files = await globby(['**/.env'], {
    ignore: ignorePatterns,
    gitignore: false,
    absolute: true,
    cwd: resolve(cwd(), '..'),
  })

  if (!hasDryRun()) {
    await Promise.all(
      files.map(async (f) => {
        await rm(f, {
          force: true,
        })
      }),
    )
    files.length ? consola.box(`Env file delete \n${files.map(d => colors.magenta(d)).join('\n')}`) : consola.error('No env file found')
  }
  else {
    consola.box(`Would be deleted \n${files.map(d => colors.magenta(d)).join('\n')}`)
  }
}

run().catch(consola.error)
