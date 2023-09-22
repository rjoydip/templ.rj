import { rmdir } from 'node:fs/promises'
import fg from 'fast-glob'
import { createLogger, logError } from '@templ/logger'
import { COMPLETED, STARTED, root } from '@templ/utils'

async function main() {
  const logger = createLogger()
  const cleanNMTxt = 'Clean node_modules directories and re-install packages'
  try {
    logger.info(`[${STARTED}]: ${cleanNMTxt}`)
    await Promise.all([
      ...(
        await fg.async('**/node_modules', {
          cwd: root,
          absolute: true,
        })
      )
        .reverse()
        .map(async (i) => {
          await rmdir(i, {
            recursive: true,
          })
        }),
    ])
    logger.info(`[${COMPLETED}]: ${cleanNMTxt}`)
  }
  catch (error) {
    logError(error)
  }
}

main()
