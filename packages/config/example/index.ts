import { cwd } from 'node:process'
import { resolve } from 'node:path'
import consola from 'consola'

import { loadConfig } from '../src'

async function main() {
  const result = await loadConfig({
    cwd: resolve(cwd(), '..', '..', '.config'),
    config: true,
    env: true,
    flag: true,
  })

  consola.log({ result })
}

main().catch(consola.error)
