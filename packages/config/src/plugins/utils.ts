import consola from 'consola'
import { colors } from 'consola/utils'
import cpy from 'cpy'

export function verboseLog({ method, msg, verbose, lineBefore }: { method: 'info' | 'log' | 'box', msg: string, verbose: boolean, lineBefore?: boolean }) {
  if (!verbose)
    return

  if (method === 'log')
    consola.log(colors.blue(lineBefore ? '\ni' : 'i'), msg)

  if (method === 'info')
    consola.info(colors.blue(lineBefore ? '\ni' : 'i'), msg)

  if (method === 'box')
    consola.box(colors.blue(lineBefore ? '\ni' : 'i'), msg)
}

export async function copyHandler({
  fromPaths,
  toDir,
  verbose = false,
  dryRun = false,
  flat = false,
}: {
  fromPaths: string[]
  toDir: string
  verbose: boolean
  dryRun: boolean
  flat: boolean
}) {
  if (!fromPaths.length) {
    verboseLog({
      method: 'info',
      msg: 'Nothing to copy',
      verbose,
    })
    return
  }

  if (!dryRun) {
    await cpy(fromPaths, toDir, {
      gitignore: true,
      overwrite: true,
      ignoreJunk: true,
      ignore: ['.git', 'node_modules', 'dist', 'temp', 'coverage'],
      flat,
    })
  }

  verboseLog({
    method: 'info',
    msg: `${dryRun ? colors.white('[DryRun] ') : ''}File copied: ${colors.white(fromPaths.join(','))} -> ${colors.white(toDir)}`,
    verbose,
  })
}
