import { join } from 'node:path'
import { log } from '@clack/prompts'
import { COMPLETED, PKG_ROOT, STARTED } from 'src/constant'
import { totalist } from 'totalist'

async function main() {
  let count = 0
  try {
    log.info(`[${STARTED}]: CI dist checking`)
    await totalist(join(String(PKG_ROOT)), async (name: string) => {
      if (/^([^\/\\]*)([\/\\]dist)([\/\\]index)\.js$/.test(name))
        count++
    })
    count === 5 ? log.success(`[${COMPLETED}]: CI > dist count matched`) : log.error('[ERROR]: CI > dist count not match')
  }
  catch (error) {
    log.error(String(error))
  }
}

main()
