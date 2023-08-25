import sade from 'sade'
import { serializeError } from 'serialize-error'

/* The code `process.on('unhandledRejection', (reason, _) => { console.error(reason) process.exit(1)
})` sets up an event listener for unhandled promise rejections. */
process.on('unhandledRejection', (reason, _) => {
  console.error(reason)
  process.exit(1)
})

/**
 * The above function is a TypeScript program that defines a command-line interface using the `sade`
 * library and includes a command called "init" that logs the options passed to it.
 */
async function main() {
  const prog = sade('@templ/cli')
  prog.version('0.0.0')

  prog
    .command('init')
    .describe('Initialize')
    .example('init')
    .action(async (opts) => {
      try {
        console.log(opts)
      }
      catch (err) {
        const error = new Error(String(err))
        const serialized = serializeError(error)
        console.error(serialized.message)
      }
    })

  prog.parse(process.argv)
}

/* The `main()` function is the entry point of the program. It sets up a command-line interface using
the `sade` library and defines a command called "init". When the "init" command is executed, it logs
the options passed to it. If an error occurs during the execution of the command, it catches the
error, serializes it using the `serialize-error` library, and logs the serialized error message. */
main()
