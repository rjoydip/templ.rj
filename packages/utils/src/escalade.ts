import { dirname, resolve } from 'node:path'
import { readdir, readdirSync, stat, statSync } from 'node:fs'
import { promisify } from 'node:util'

// eslint-disable-next-line ts/no-invalid-void-type
type ReturnType = string | void
// eslint-disable-next-line ts/no-invalid-void-type
type PromiseType = Promise<string | false | void>

const toStats = promisify(stat)
const toRead = promisify(readdir)

export function escaladeSync(start: string, callback: (directory: string, files: string[]) => ReturnType): ReturnType {
  let dir = resolve('.', start)
  let tmp
  const stats = statSync(dir)

  if (!stats.isDirectory())
    dir = dirname(dir)

  do {
    tmp = callback(dir, readdirSync(dir))
    if (tmp)
      return resolve(dir, tmp)
    dir = dirname(tmp = dir)
    if (tmp === dir)
      break
  } while (true)
}

export async function escaladeAsync(start: string, callback: (directory: string, files: string[]) => PromiseType): PromiseType {
  let dir = resolve('.', start)
  let tmp
  const stats = await toStats(dir)

  if (!stats.isDirectory())
    dir = dirname(dir)

  do {
    tmp = await callback(dir, await toRead(dir))
    if (tmp)
      return resolve(dir, tmp)
    dir = dirname(tmp = dir)
    if (tmp === dir)
      break
  } while (true)
}
