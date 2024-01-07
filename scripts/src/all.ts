import { argv } from 'node:process'
import { intro, log, outro } from '@clack/prompts'
import parser from 'yargs-parser'
import { $ } from 'zx'
import isInCi from 'is-in-ci'
import colors from 'picocolors'
import { COMPLETED, STARTED } from './utils/constant'
import { executeCommand } from './utils'

async function main() {
  $.verbose = false
  console.clear()

  intro(`${colors.cyan('Setup')}`)

  // Pre processes - start
  log.warn(`${colors.yellow(`${STARTED} Pre Process`)}`)

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
  await executeCommand({
    title: 'Installing via pnpm',
    execute: async () => await $`pnpm i`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Cleaning
  await executeCommand({
    title: 'Clean',
    execute: async () => await $`pnpm -w clean`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Linting
  await executeCommand({
    title: 'Lint',
    execute: async () => _argv ? await $`pnpm lint ${_argv}` : await $`pnpm lint`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  log.info(`${colors.blue(`${COMPLETED} Pre Process`)}`)
  // Pre processes - end

  // Main processes - start
  log.warn(`${colors.yellow(`${STARTED} Process`)}`)

  // Build packages
  await executeCommand({
    title: 'Build',
    execute: async () => await $`pnpm -w build`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Test
  await executeCommand({
    title: 'Test',
    execute: async () => await $`pnpm -w test`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // CLI test
  await executeCommand({
    title: 'Test CLI',
    execute: async () => await $`pnpm -w test:cli`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  log.info(`${colors.blue(`${COMPLETED} Process`)}`)
  // Main processes - end

  // Post processes - start
  log.warn(`${colors.yellow(`${STARTED} Post Process`)}`)

  // Size limit
  await executeCommand({
    title: 'Size limit',
    execute: async () => await $`npx size-limit`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Changelog
  await executeCommand({
    title: 'Changelog',
    execute: async () => await $`npx changelog`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // System info
  await executeCommand({
    title: 'System Info',
    execute: async () => await $`npx envinfo --system --binaries --browsers`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Update package dependency
  await executeCommand({
    title: 'Update dependencies',
    execute: async () => await $`pnpm -w deps:update`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  log.info(`${colors.blue(`${COMPLETED} Post Process`)}`)
  // Post processes - end

  outro(`${colors.cyan('All set')}`)
}

main().catch(console.error)
