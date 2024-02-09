import { serve } from '@hono/node-server'
import autocannon from 'autocannon'
import consola from 'consola'
import { colors } from 'consola/utils'
import app from '../src/app'

const server = serve({
  fetch: app.fetch,
  port: 3000,
}).on('listening', () => consola.log(colors.green(`🔥 Templ server running on ${colors.cyan(3000)}`)))

const { statusCodeStats } = await autocannon({
  url: 'http://localhost:3000',
  connections: 10,
  pipelining: 1,
})
consola.box(statusCodeStats)

server.close()
