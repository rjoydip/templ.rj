import { argv, exit } from 'node:process'
import { consola } from 'consola'
import sade from 'sade'

// eslint-disable-next-line node/prefer-global/process
process.on('unhandledRejection', (reason, _) => {
  console.error(String(reason))
  exit(0)
})

async function main() {
  const prog = sade('@templ/cli')
  prog.version('0.0.0')

  prog
    .command('init')
    .describe('Initialize')
    .example('init')
    .action(async (opts) => {
      try {
        consola.box(opts)
      }
      catch (error) {
        consola.error(String(error))
      }
    })

  prog.parse(argv)
}

main().catch(consola.error)
