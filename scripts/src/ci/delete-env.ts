import { join } from 'node:path'
import { rm } from 'node:fs/promises'
import { totalist } from 'totalist'
import { log } from '@clack/prompts'
import { COMPLETED, STARTED } from '../constant'
import { PKG_ROOT } from '../utils'

async function main() {
  try {
    log.info(`[${STARTED}]: CI env file delete`)
    await totalist(join(String(PKG_ROOT), 'api', 'services'), async (name: string, abs: string) => {
      if (/\.env$/.test(name))
        await rm(abs)
    })
    log.success(`[${COMPLETED}]: CI env file delete`)
  }
  catch (error) {
    log.error(String(error))
  }
}

main().catch(console.error)
