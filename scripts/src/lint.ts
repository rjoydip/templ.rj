import { intro, log, outro, spinner } from '@clack/prompts'
import colors from 'picocolors'
import { COMPLETED, STARTED } from './constant'
import { execCmd, execNpx } from './utils'

async function main() {
  const s = spinner()
  intro(`${colors.cyan('Linting')}`)

  log.warn(`${colors.yellow(`${STARTED} Linting Process`)}`)

  // ESlint
  await execNpx({
    cmd: 'eslint --color --cache --fix --cache-location .eslintcache .',
    msg: {
      start: 'ESlint',
      stop: 'ESlint completed',
    },
    spinner: s,
  })

  // Markdown lint
  await execNpx({
    cmd: 'esno ./src/lint-md.ts',
    msg: {
      start: 'Markdown linting',
      stop: 'Markdown lint completed',
    },
    spinner: s,
  })

  // Secret lint
  await execNpx({
    cmd: 'secretlint --secretlintignore .gitignore \"**/*\"',
    msg: {
      start: 'Secret linting',
      stop: 'Secret lint completed',
    },
    spinner: s,
  })

  // Size report
  await execCmd({
    cmd: 'pnpm -w size:report',
    msg: {
      start: 'Size reporting',
      stop: 'Size reported',
    },
    spinner: s,
  })

  // Spell check
  await execNpx({
    cmd: 'cspell ../',
    msg: {
      start: 'Spell checking',
      stop: 'Spell check completed',
    },
    spinner: s,
  })

  // Knip
  await execNpx({
    cmd: 'knip --no-gitignore --directory ../ --no-exit-code',
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
