import { intro, log, outro, spinner } from '@clack/prompts'
import colors from 'picocolors'
import { COMPLETED, STARTED } from './constant'
import { execCmd } from './utils'

async function main() {
  const s = spinner()
  intro(`${colors.cyan('Linting')}`)

  log.warn(`${colors.yellow(`${STARTED} Linting Process`)}`)

  // ESlint
  await execCmd({
    cmd: 'npx eslint --color --cache --fix --cache-location .eslintcache ../',
    msg: {
      start: 'ESlint',
      stop: 'ESlint completed',
    },
    spinner: s,
  })

  // Markdown lint
  await execCmd({
    cmd: 'esno ./src/lint-md.ts',
    msg: {
      start: 'Markdown linting',
      stop: 'Markdown lint completed',
    },
    spinner: s,
  })

  // Secret lint
  await execCmd({
    cmd: 'pnpm -w secretlint',
    msg: {
      start: 'Secret linting',
      stop: 'Secret lint completed',
    },
    spinner: s,
  })

  // Size report
  /* await execCmd({
    cmd: 'pnpm -w size:report',
    msg: {
      start: 'Size reporting',
      stop: 'Size reported',
    },
    spinner: s,
  }) */

  // Spell check
  await execCmd({
    cmd: 'pnpm -w spell:check',
    msg: {
      start: 'Spell checking',
      stop: 'Spell check completed',
    },
    spinner: s,
  })

  // Knip
  await execCmd({
    cmd: 'pnpm -w knip',
    msg: {
      start: 'Knip started',
      stop: 'Knip completed',
    },
    spinner: s,
  })

  log.info(`${colors.blue(`${COMPLETED} Linting Process`)}`)
  outro(`${colors.cyan('All Set')}`)
}

main().catch(console.error)
