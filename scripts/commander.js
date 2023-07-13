import { $ } from 'execa'
import ora from 'ora'
import sade from 'sade'
import { serializeError } from 'serialize-error'

process.on('unhandledRejection', (reason, _) => {
  console.error(reason)
  process.exit(1)
})

async function cleanFile(fileName = '') {
  await $`rm -f ${fileName}`
}

async function cleanDir(dirName = '') {
  await $`rm -rf ${dirName}`
}

async function cleanNested(src = '', dest = '') {
  await $`rm -rf ${src}/**/${dest}`
}

void async function () {
  const prog = sade('Commander')

  prog
    .command('clean')
    .describe('Clean unnecessary directories')
    .option('-nm, --nm', 'Clean node_modules directories')
    .example('clean')
    .example('clean --nm')
    .action(async (opts) => {
      const spinner = ora()
      spinner.start(`Cleanup started \n`)
      try {
        if (opts.nm) {
          await Promise.all([
            cleanDir('node_modules'),
            cleanNested('packages', 'node_modules'),
            await $`rm -rf packages/node_modules`
          ])
        } else {
          await Promise.all([
            cleanDir('coverage'),
            cleanFile('.eslintcache'),
            cleanDir('.pnpm-store'),
            cleanNested('packages', 'dist'),
            cleanNested('fixtures', 'output')
          ])
        }
        spinner.succeed('Cleanup completed')
      } catch (err) {
        const error = new Error(String(err))
        const serialized = serializeError(error)
        spinner.fail(serialized.message)
      }
    })

  prog.parse(process.argv)
}()
