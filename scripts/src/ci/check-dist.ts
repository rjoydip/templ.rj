import { join } from 'node:path'
import { COMPLETED, PKG_ROOT, STARTED } from 'src/constant'
import { totalist } from 'totalist'

async function main() {
  let count = 0
  try {
    console.log(`[${STARTED}]: CI dist checking`)
    await totalist(join(String(PKG_ROOT)), async (name: string) => {
      if (/^([^\/\\]*)([\/\\]dist)([\/\\]index)\.js$/.test(name))
        count++
    })
    count === 5 ? console.log(`[${COMPLETED}]: CI > dist count matched`) : console.error('[ERROR]: CI > dist count not match')
  }
  catch (error) {
    console.error(error)
  }
}

main()
