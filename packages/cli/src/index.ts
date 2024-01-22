import { argv, exit } from 'node:process'
import consola from 'consola'
import sade from 'sade'

// eslint-disable-next-line node/prefer-global/process
process.on('unhandledRejection', (reason, _) => {
  console.error(String(reason))
  exit(0)
})

export async function run() {
  const prog = sade('@templ/cli')
  prog.version('0.0.0')

  prog
    .command('init')
    .describe('Initialize')
    .example('init')
    .action(async (opts) => {
      consola.box(opts)
    })

  prog.parse(argv)
}

run().catch(consola.error)
