import { cp } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { log } from '@clack/prompts'
import { totalist } from 'totalist'
import { STARTED } from '../constant'
import { PKG_ROOT } from '../utils'

async function main() {
  try {
    log.info(`[${STARTED}]: CI env coping`)
    await totalist(join(String(PKG_ROOT), 'api', 'services'), async (name: string, abs: string) => {
      if (/\.env.sample$/.test(name))
        await cp(abs, join(dirname(abs), '.env'), { force: true })
    })
    log.success(`[${PKG_ROOT}]: CI env copied`)
  }
  catch (error) {
    log.error(String(error))
  }
}

main().catch(console.error)
