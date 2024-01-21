import autocannon from 'autocannon'
import consola from 'consola'

async function main() {
  consola.start('Server benchmark started')
  const { statusCodeStats } = await autocannon({
    url: 'http://localhost:3000',
    connections: 10,
    pipelining: 1,
    duration: 10,
  })
  consola.box(statusCodeStats)
  consola.success('Server benchmark completed')
}

main().catch(consola.error)
