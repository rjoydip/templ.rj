import { join } from 'node:path'
import { rm } from 'node:fs/promises'
import { totalist } from 'totalist'
import { createLogger, logError } from '@templ/logger'
import { COMPLETED, STARTED, pkgRoot } from '@templ/utils'

const logger = createLogger()

async function main() {
  try {
    logger.success(`[${STARTED}]: CI env file delete`)
    await totalist(join(String(pkgRoot), 'api', 'services'), async (name: string, abs: string) => {
      if (/\.env$/.test(name))
        await rm(abs)
    })
    logger.success(`[${COMPLETED}]: CI env file delete`)
  }
  catch (error) {
    logError(error)
  }
}

main()
