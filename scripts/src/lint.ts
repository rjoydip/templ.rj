import { cancel, intro, log, outro, spinner } from '@clack/prompts'
import { $ } from 'zx/core'
import colors from 'picocolors'

async function main() {
  const s = spinner()
  intro(`${colors.cyan('Linting')}`)

  try {
    s.start('ESlint ')
    const eslintOutput = await $`eslint --color --cache --fix --cache-location .eslintcache .`
    s.stop('ESlint done')
    if (eslintOutput)
      log.message(String(eslintOutput))

    s.start('Markdown linting ')
    const mdLintOutput = await $`esno ./src/lint/md.ts`
    s.stop('Markdown lint completed')
    if (mdLintOutput)
      log.message(String(mdLintOutput))

    s.start('Secret linting ')
    const secretLintOutput = await $`secretlint --secretlintignore .gitignore \"**/*\"`
    s.stop('Secret lint completed')
    if (secretLintOutput)
      log.message(String(secretLintOutput))

    s.start('Size reporting ')
    const sizeReportOutput = await $`esno ./src/size/report.ts`
    s.stop('Size reported')
    if (sizeReportOutput)
      log.message(String(sizeReportOutput))

    s.start('Spell checking ')
    const cspellOutput = await $`cspell ../`
    s.stop('Spell check completed')
    if (cspellOutput)
      log.message(String(cspellOutput))

    s.start('Knip started ')
    const knipOutput = await $`knip --no-gitignore --directory ../ --no-exit-code`
    s.stop('Knip completed')
    if (knipOutput)
      log.message(String(knipOutput))
  }
  catch (error) {
    log.error(String(error))
    cancel(String(error))
  }

  outro(`${colors.cyan('All Set')}`)
}

main().catch(console.error)
