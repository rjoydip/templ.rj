import { intro, log, outro, spinner } from '@clack/prompts'
import colors from 'picocolors'
import { COMPLETED, STARTED } from './constant'
import { execCmd } from './utils'

async function main() {
  const s = spinner()
  console.clear()

  intro(`${colors.cyan('Setup')}`)

  // Pre processes - start
  log.warn(`${colors.yellow(`${STARTED} Pre Process`)}`)

  // Installation
  await execCmd({
    cmd: 'pnpm i',
    msg: {
      start: 'Installing via pnpm',
      stop: 'Installed via pnpm',
    },
    spinner: s,
  })

  // Cleaning
  await execCmd({
    cmd: 'pnpm -w clean',
    msg: {
      start: 'Cleaning',
      stop: 'Cleaned',
    },
    spinner: s,
  })

  // Linting
  await execCmd({
    cmd: 'pnpm -w lint',
    msg: {
      start: 'Lint started',
      stop: 'Lint completed',
    },
    spinner: s,
  })

  log.info(`${colors.blue(`${COMPLETED} Pre Process`)}`)
  // Pre processes - end

  // Main processes - start
  log.warn(`${colors.yellow(`${STARTED} Process`)}`)

  // Build packages
  await execCmd({
    cmd: 'pnpm -w build',
    msg: {
      start: 'Build',
      stop: 'Build completed',
    },
    spinner: s,
  })

  // Test
  await execCmd({
    cmd: 'pnpm -w test',
    msg: {
      start: 'Testing',
      stop: 'Test completed',
    },
    spinner: s,
  })

  // CLI test
  await execCmd({
    cmd: 'pnpm -w test:cli',
    msg: {
      start: 'Testing CLI',
      stop: 'CLI tested',
    },
    spinner: s,
  })

  // Size limit
  await execCmd({
    cmd: 'npx size:limit',
    msg: {
      start: 'Size limit checking',
      stop: 'Size limit check completed',
    },
    spinner: s,
  })

  log.info(`${colors.blue(`${COMPLETED} Process`)}`)
  // Main processes - end

  // Post processes - start
  log.warn(`${colors.yellow(`${STARTED} Post Process`)}`)

  // Changelog
  await execCmd({
    cmd: 'npx changelog',
    msg: {
      start: 'Generating changelog',
      stop: 'Generated changelog',
    },
    spinner: s,
  })

  // System info
  await execCmd({
    cmd: 'npx envinfo --system --binaries --browsers',
    msg: {
      start: 'System info',
      stop: 'Generated system info',
    },
    spinner: s,
  })

  // Update package dependency
  await execCmd({
    cmd: 'npx taze -r -w -i -f -l --ignore-paths="third_party/**"',
    msg: {
      start: 'Dependency updating',
      stop: 'Dependency updated',
    },
    spinner: s,
  })

  // Third party update
  await execCmd({
    cmd: 'pnpm -w update:third_party',
    msg: {
      start: 'Updating third party',
      stop: 'Updated third party',
    },
    spinner: s,
  })

  log.info(`${colors.blue(`${COMPLETED} Post Process`)}`)
  // Post processes - end

  outro(`${colors.cyan('All set')}`)
}

main().catch(console.error)
