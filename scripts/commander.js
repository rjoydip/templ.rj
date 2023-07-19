import { join } from 'node:path'
import { $ } from 'execa'
import ora from 'ora'
import sade from 'sade'
import { serializeError } from 'serialize-error'

process.on('unhandledRejection', (reason, _) => {
  console.error(reason)
  process.exit(1)
})

async function cleanFile(fileName = '') {
  const spinner = ora(`Cleanup ${fileName} - started`).start()
  await $`rm -f ${fileName}`
  spinner.succeed(`${fileName} - completed`)
}

async function cleanDir(dirName = '') {
  const spinner = ora(`Cleanup ${dirName} - started`).start()
  await $`rm -rf ${dirName}`
  spinner.succeed(`${dirName} - completed`)
}

async function cleanNested(src = '', dest = '') {
  const spinner = ora(`Cleanup ${src}/**/${dest} - started`).start()
  await $`rm -rf ${src}/**/${dest}`
  spinner.succeed(`${src}/**/${dest} - completed`)
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
      try {
        if (opts.nm) {
          await Promise.all([
            await cleanDir('node_modules'),
            await cleanNested('packages', 'node_modules'),
            await $`rm -rf packages/node_modules`
          ])
        } else {
          await Promise.all([
            await cleanDir('coverage'),
            await cleanFile('.eslintcache'),
            await cleanDir('.pnpm-store'),
            await cleanDir(join('packages', 'ui', 'storybook-static')),
            await cleanNested('packages', 'dist'),
            await cleanNested('fixtures', 'output')
          ])
        }
      } catch (err) {
        const error = new Error(String(err))
        const serialized = serializeError(error)
        ora().fail(serialized.message)
      }
    })

  prog.parse(process.argv)
}()
