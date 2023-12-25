import { argv, exit } from 'node:process'
import sade from 'sade'
import { createLogger, logError } from '@templ/logger'

// eslint-disable-next-line node/prefer-global/process
process.on('unhandledRejection', (reason, _) => {
  logError(reason)
  exit(1)
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
        createLogger().log(opts)
      }
      catch (error: any) {
        logError(error)
      }
    })

  prog.parse(argv)
}

main()
