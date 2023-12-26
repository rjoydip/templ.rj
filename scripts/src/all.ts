import { argv } from 'node:process'
import { intro, log, outro, spinner } from '@clack/prompts'
import colors from 'picocolors'
import parser from 'yargs-parser'
import { $ } from 'zx'
import { COMPLETED, STARTED } from './utils/constant'

async function main() {
  console.clear()
  const s = spinner()

  intro(`${colors.cyan('Setup')}`)

  // Pre processes - start
  log.warn(`${colors.yellow(`${STARTED} Pre Process`)}`)

  const {
    noSpinner,
  } = parser(argv.slice(2), {
    configuration: {
      'boolean-negation': false,
    },
  })

  // Installation
  if (!noSpinner)
    s.start('Installing via pnpm ')
  const pnpmInstallOutput = await $`pnpm i`
  if (!noSpinner)
    s.stop('Installed via pnpm done')
  log.message(String(pnpmInstallOutput || ''))

  // Cleaning
  if (!noSpinner)
    s.start('Cleaning ')
  const cleanOutput = await $`pnpm -w clean`
  if (!noSpinner)
    s.stop('Cleaned')
  log.message(String(cleanOutput || ''))

  // Linting
  if (!noSpinner)
    s.start('Lint started ')
  const lintOutput = await $`pnpm lint --no-spinner`
  if (!noSpinner)
    s.stop('Lint completed')
  log.message(String(lintOutput || ''))

  log.info(`${colors.blue(`${COMPLETED} Pre Process`)}`)
  // Pre processes - end

  // Main processes - start
  log.warn(`${colors.yellow(`${STARTED} Process`)}`)

  // Build packages
  if (!noSpinner)
    s.start('Build ')
  const buildOutput = await $`pnpm -w build`
  if (!noSpinner)
    s.stop('Build completed')
  log.message(String(buildOutput || ''))

  // Test
  if (!noSpinner)
    s.start('Testing ')
  const testOutput = await $`pnpm -w test`
  if (!noSpinner)
    s.stop('Test completed')
  log.message(String(testOutput || ''))

  // CLI test
  if (!noSpinner)
    s.start('Testing ')
  const testCliOutput = await $`pnpm -w test:cli`
  if (!noSpinner)
    s.stop('Test completed')
  log.message(String(testCliOutput || ''))

  log.info(`${colors.blue(`${COMPLETED} Process`)}`)
  // Main processes - end

  // Post processes - start
  log.warn(`${colors.yellow(`${STARTED} Post Process`)}`)

  // Size limit
  if (!noSpinner)
    s.start('Size limit ')
  const sizeLimitOutput = await $`npx size-limit`
  if (!noSpinner)
    s.stop('Size limit committed')
  log.message(String(sizeLimitOutput || ''))

  // Changelog
  if (!noSpinner)
    s.start('Generating changelog ')
  const changelogOutput = await $`npx changelog`
  if (!noSpinner)
    s.stop('Generated changelog')
  log.message(String(changelogOutput || ''))

  // System info
  if (!noSpinner)
    s.start('System info ')
  const envInfoOutput = await $`npx envinfo --system --binaries --browsers`
  if (!noSpinner)
    s.stop('Generated system info')
  log.message(String(envInfoOutput || ''))

  // Update package dependency
  if (!noSpinner)
    s.start('Dependency updating ')
  const depsUpdateOutput = await $`npx taze -r -w -i -f -l --ignore-paths="third_party/**"`
  if (!noSpinner)
    s.stop('Dependency updated')
  log.message(String(depsUpdateOutput || ''))

  // Third party update
  if (!noSpinner)
    s.start('Updating third party ')
  const updateThirdPartyOutput = await $`pnpm -w update:third_party`
  if (!noSpinner)
    s.stop('Updated third party')
  log.message(String(updateThirdPartyOutput || ''))

  log.info(`${colors.blue(`${COMPLETED} Post Process`)}`)
  // Post processes - end

  outro(`${colors.cyan('All set')}`)
}

main().catch(console.error)
