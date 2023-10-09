import { cp } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { totalist } from 'totalist'
import { createLogger, logError } from '@templ/logger'
import { COMPLETED, STARTED, pkgRoot } from '@templ/utils'

const logger = createLogger()

async function main() {
  try {
    logger.success(`[${STARTED}]: CI env coping`)
    await totalist(join(String(pkgRoot), 'api', 'services'), async (name: string, abs: string) => {
      if (/\.env.sample$/.test(name))
        await cp(abs, join(dirname(abs), '.env'), { force: true })
    })
    logger.success(`[${COMPLETED}]: CI env coping`)
  }
  catch (error) {
    logError(error)
  }
}

main()
