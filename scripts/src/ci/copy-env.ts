import { cp } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { PKG_ROOT, STARTED } from 'src/constant'
import { totalist } from 'totalist'

async function main() {
  try {
    console.log(`[${STARTED}]: CI env coping`)
    await totalist(join(String(PKG_ROOT), 'api', 'services'), async (name: string, abs: string) => {
      if (/\.env.sample$/.test(name))
        await cp(abs, join(dirname(abs), '.env'), { force: true })
    })
    console.log(`[${PKG_ROOT}]: CI env coping`)
  }
  catch (error) {
    console.error(error)
  }
}

main()
