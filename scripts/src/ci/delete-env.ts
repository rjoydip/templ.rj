import { join } from 'node:path'
import { rm } from 'node:fs/promises'
import { totalist } from 'totalist'
import { COMPLETED, PKG_ROOT, STARTED } from 'src/constant'

async function main() {
  try {
    console.log(`[${STARTED}]: CI env file delete`)
    await totalist(join(String(PKG_ROOT), 'api', 'services'), async (name: string, abs: string) => {
      if (/\.env$/.test(name))
        await rm(abs)
    })
    console.log(`[${COMPLETED}]: CI env file delete`)
  }
  catch (error) {
    console.error(error)
  }
}

main()
