import { rmdir } from 'node:fs/promises'
import { join, normalize } from 'node:path'
import { glob } from 'glob'
import { COMPLETED, STARTED, logError } from './utils'

void (async () => {
  const cleanNMTxt = 'Clean node_modules directories and re-install packages'
  try {
    console.log(`[${STARTED}]: ${cleanNMTxt}`)
    await Promise.allSettled([
      ...(await glob('**/node_modules', { cwd: normalize(join(process.cwd(), '..')), absolute: true }))
        .reverse()
        .map(async (i) => {
          await rmdir(i, {
            recursive: true,
          })
        }),
    ])
    console.log(`[${COMPLETED}]: ${cleanNMTxt}`)
  } catch (error) {
    logError(error)
  }
})()
