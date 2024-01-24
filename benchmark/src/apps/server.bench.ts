import autocannon from 'autocannon'
import consola from 'consola'

export async function run() {
  consola.start('\nServer benchmark started\n')
  const { statusCodeStats } = await autocannon({
    url: 'http://localhost:3000',
    connections: 10,
    pipelining: 1,
    duration: 10,
  })
  consola.box(statusCodeStats)
  consola.success('\nServer benchmark completed\n')
}

run().catch(consola.error)
