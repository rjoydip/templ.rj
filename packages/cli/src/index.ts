import sade from 'sade'
import { serializeError } from 'serialize-error'

process.on('unhandledRejection', (reason, _) => {
  console.error(reason)
  process.exit(1)
})

async function main() {
  const prog = sade('TEMPL')
  prog.version('0.0.0')

  prog
    .command('init')
    .describe('Initialize')
    .example('init')
    .action(async (opts) => {
      try {
        console.log(opts)
      } catch (err) {
        const error = new Error(String(err))
        const serialized = serializeError(error)
        console.error(serialized.message)
      }
    })

  prog.parse(process.argv)
}

main()
