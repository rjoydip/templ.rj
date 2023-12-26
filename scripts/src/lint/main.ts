import { argv } from 'node:process'
import { intro, log, outro, spinner } from '@clack/prompts'
import colors from 'picocolors'
import parser from 'yargs-parser'
import { $ } from 'zx'
import isInCi from 'is-in-ci'

async function main() {
  const s = spinner()
  intro(`${colors.cyan('Linting')}`)

  let {
    noSpinner,
  } = parser(argv.slice(2), {
    configuration: {
      'boolean-negation': false,
    },
  })

  if (isInCi)
    noSpinner = true

  // ESlint
  if (!noSpinner)
    s.start('ESlint ')
  const eslintOutput = await $`eslint --color --cache --fix --cache-location .eslintcache .`
  if (!noSpinner)
    s.stop('ESlint done')
  log.message(String(eslintOutput || ''))

  // Markdown
  if (!noSpinner)
    s.start('Markdown linting ')
  const mdLintOutput = await $`esno ./src/lint/md.ts`
  if (!noSpinner)
    s.stop('Markdown lint completed')
  log.message(String(mdLintOutput || ''))

  // Secret
  if (!noSpinner)
    s.start('Secret linting ')
  const secretLintOutput = await $`secretlint --secretlintignore .gitignore \"**/*\"`
  if (!noSpinner)
    s.stop('Secret lint completed')
  log.message(String(secretLintOutput || ''))

  // Size report
  if (!noSpinner)
    s.start('Size reporting ')
  const sizeReportOutput = await $`esno ./src/size/report.ts`
  if (!noSpinner)
    s.stop('Size reported')
  log.message(String(sizeReportOutput || ''))

  // Spell
  if (!noSpinner)
    s.start('Spell checking ')
  const cspellOutput = await $`cspell ../`
  if (!noSpinner)
    s.stop('Spell check completed')
  if (cspellOutput)
    log.message(String(cspellOutput || ''))

  // Knip
  if (!noSpinner)
    s.start('Knip started ')
  const knipOutput = await $`knip --no-gitignore --directory ../ --no-exit-code`
  if (!noSpinner)
    s.stop('Knip completed')
  log.message(String(knipOutput || ''))

  outro(`${colors.cyan('All Set')}`)
}

main().catch(console.error)
