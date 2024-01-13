import { argv, exit } from 'node:process'
import { intro, log, outro } from '@clack/prompts'
import parser from 'yargs-parser'
import isInCi from 'is-in-ci'
import colors from 'picocolors'
import { exeCmd } from './utils'

async function main() {
  intro(`${colors.cyan('Setup')}`)

  // Pre processes - start
  log.warn(`${colors.yellow(`Started Pre Process`)}`)

  const _argv = argv.slice(2)

  let {
    noOutput = false,
    noSpinner = false,
  } = parser(_argv, {
    configuration: {
      'boolean-negation': false,
    },
  })

  if (isInCi) {
    noOutput = true
    noSpinner = true
  }

  // Installation
  await exeCmd({
    title: 'Installing',
    cmd: 'pnpm i',
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Linting
  const lintScript = 'pnpm lint'
  await exeCmd({
    title: 'Linting',
    cmd: _argv ? `${lintScript} ${_argv}` : lintScript,
    showOutput: !noOutput,
    isSubProcess: true,
  })

  log.info(`${colors.blue(`Completed Pre Process`)}`)
  // Pre processes - end

  // Main processes - start
  log.warn(`${colors.yellow(`Started Process`)}`)

  // Build packages
  await exeCmd({
    title: 'Build',
    cmd: 'pnpm -w build',
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Test
  await exeCmd({
    title: 'Test',
    cmd: 'pnpm -w test',
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // CLI test
  await exeCmd({
    title: 'Test CLI',
    cmd: 'pnpm -w test:cli',
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  log.info(`${colors.blue(`Completed Process`)}`)
  // Main processes - end

  // Post processes - start
  log.warn(`${colors.yellow(`Started Post Process`)}`)

  // Size limit
  await exeCmd({
    title: 'Size limit',
    cmd: 'npx size-limit',
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Changelog
  await exeCmd({
    title: 'Changelog',
    cmd: 'npx changelog',
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Update package dependency
  await exeCmd({
    title: 'Update dependencies',
    cmd: 'pnpm -w deps:update',
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  log.info(`${colors.blue(`Completed Post Process`)}`)
  // Post processes - end

  outro(`${colors.cyan('All set')}`)

  exit(0)
}

main().catch(console.error)
