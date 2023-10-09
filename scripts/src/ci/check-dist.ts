import { join } from 'node:path'
import { totalist } from 'totalist'
import { createLogger, logError } from '@templ/logger'
import { COMPLETED, STARTED, pkgRoot } from '@templ/utils'

const logger = createLogger()

async function main() {
  let count = 0
  try {
    logger.success(`[${STARTED}]: CI dist checking`)
    await totalist(join(String(pkgRoot)), async (name: string) => {
      if (/^([^\/\\]*)([\/\\]dist)([\/\\]index)\.js$/.test(name))
        count++
    })
    count === 5 ? logger.success(`[${COMPLETED}]: CI > dist validated successfully`) : logger.warn(`[${COMPLETED}]: CI > dist validation not match`)
  }
  catch (error) {
    logError(error)
  }
}

main()
