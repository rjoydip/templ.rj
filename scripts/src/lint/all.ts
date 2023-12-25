import { intro, log, outro } from '@clack/prompts'
import colors from 'picocolors'
import { COMPLETED, STARTED } from '../utils/constant'
import { execNpx } from '../utils'

async function main() {
  intro(`${colors.cyan('Linting')}`)

  log.warn(`${colors.yellow(`${STARTED} Linting Process`)}`)

  // ESlint
  await execNpx({
    cmd: 'eslint --color --cache --fix --cache-location .eslintcache .',
    msg: {
      start: 'ESlint',
      stop: 'ESlint completed',
    },
  })

  // Markdown lint
  await execNpx({
    cmd: 'esno ./src/lint-md.ts',
    msg: {
      start: 'Markdown linting',
      stop: 'Markdown lint completed',
    },
  })

  // Secret lint
  await execNpx({
    cmd: 'secretlint --secretlintignore .gitignore \"**/*\"',
    msg: {
      start: 'Secret linting',
      stop: 'Secret lint completed',
    },
  })

  // Size report
  await execNpx({
    cmd: 'esno ./src/size/report.ts',
    msg: {
      start: 'Size reporting',
      stop: 'Size reported',
    },
  })

  // Spell check
  await execNpx({
    cmd: 'cspell ../',
    msg: {
      start: 'Spell checking',
      stop: 'Spell check completed',
    },
  })

  // Knip
  await execNpx({
    cmd: 'knip --no-gitignore --directory ../ --no-exit-code',
    msg: {
      start: 'Knip started',
      stop: 'Knip completed',
    },
  })

  log.info(`${colors.blue(`${COMPLETED} Linting Process`)}`)
  outro(`${colors.cyan('All Set')}`)
}

main().catch(console.error)
