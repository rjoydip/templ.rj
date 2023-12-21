import { cp } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { log } from '@clack/prompts'
import { PKG_ROOT, STARTED } from 'src/constant'
import { totalist } from 'totalist'

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
