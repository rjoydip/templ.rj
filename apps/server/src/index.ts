import { cwd } from 'node:process'
import { serve } from '@hono/node-server'
import consola from 'consola'
import { colors } from 'consola/utils'
import { loadTeamplConfig } from '@templ/config'
import app from './app'

async function run() {
  const config = await loadTeamplConfig({
    cwd: cwd(),

  })
  consola.log(config)
  const server = serve({
    fetch: app.fetch,
    port: 3000,
  }).on('listening', () => consola.log(colors.green(`🔥 Templ server running on ${colors.cyan(3000)}`)))

  // eslint-disable-next-line node/prefer-global/process
  process.on('SIGINT', () => {
    consola.log('Ctrl-C was pressed')
    server.close()
  })
}

run().catch(consola.error)
