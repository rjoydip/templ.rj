import { dirname, resolve } from 'node:path'
import { readdirSync, statSync } from 'node:fs'

// eslint-disable-next-line ts/no-invalid-void-type
type ReturnType = string | void
type Callback = (directory: string, files: string[]) => ReturnType

export default function (start: string, callback: Callback): ReturnType {
  let dir = resolve('.', start)
  let tmp
  const stats = statSync(dir)

  if (!stats.isDirectory())
    dir = dirname(dir)

  while (true) {
    tmp = callback(dir, readdirSync(dir))
    if (tmp)
      return resolve(dir, tmp)
    dir = dirname(tmp = dir)
    if (tmp === dir)
      break
  }
}
