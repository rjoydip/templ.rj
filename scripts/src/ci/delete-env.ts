import { join } from 'node:path'
import { rm } from 'node:fs/promises'
import { totalist } from 'totalist'
import { COMPLETED, PKG_ROOT, STARTED } from 'src/constant'
import { log } from '@clack/prompts'

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
