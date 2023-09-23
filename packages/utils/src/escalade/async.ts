import { dirname, resolve } from 'node:path'
import { readdir, stat } from 'node:fs'
import { promisify } from 'node:util'

const toStats = promisify(stat)
const toRead = promisify(readdir)

// eslint-disable-next-line ts/no-invalid-void-type
type PromiseType = Promise<string | false | void>
type Callback = (directory: string, files: string[]) => PromiseType

export default async function (start: string, callback: Callback): PromiseType {
  let dir = resolve('.', start)
  let tmp
  const stats = await toStats(dir)

  if (!stats.isDirectory())
    dir = dirname(dir)

  while (true) {
    tmp = await callback(dir, await toRead(dir))
    if (tmp)
      return resolve(dir, tmp)
    dir = dirname(tmp = dir)
    if (tmp === dir)
      break
  }
}
