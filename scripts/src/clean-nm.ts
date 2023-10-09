import fg from 'fast-glob'
import { createLogger, logError } from '@templ/logger'
import { COMPLETED, STARTED } from '@templ/utils'

async function main() {
  const logger = createLogger()
  const cleanNMTxt = 'Clean node_modules directories and re-install packages'
  try {
    logger.info(`[${STARTED}]: ${cleanNMTxt}`)
    const findings = fg.globSync('**/node_modules', {
      absolute: false,
    })
    console.log(findings)
    logger.info(`[${COMPLETED}]: ${cleanNMTxt}`)
  }
  catch (error) {
    logError(error)
  }
}

main()
