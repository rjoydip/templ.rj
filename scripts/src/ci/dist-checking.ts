import { join } from 'node:path'
import { totalist } from 'totalist'
import { createLogger, logError } from '@templ/logger'
import { COMPLETED, STARTED, pkgRoot } from '@templ/utils'

const logger = createLogger()

async function main() {
  try {
    logger.success(`[${STARTED}]: CI dist checking`)
    await totalist(join(String(pkgRoot)), async (name: string) => {
      if (/^([^\/\\]*)([\/\\]dist)([\/\\]index)\.js$/.test(name))
        logger.info('>>>', name)
    })
    logger.success(`[${COMPLETED}]: CI dist checking`)
  }
  catch (error) {
    logError(error)
  }
}

main()
