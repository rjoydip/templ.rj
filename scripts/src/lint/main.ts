import { argv } from 'node:process'
import { intro, log, outro } from '@clack/prompts'
import colors from 'picocolors'
import parser from 'yargs-parser'
import { $ } from 'zx'
import isInCi from 'is-in-ci'
import { executeCommand } from 'src/utils'

async function main() {
  intro(`${colors.cyan('Linting')}`)

  let {
    noOutput = false,
    noSpinner = false,
  } = parser(argv.slice(2), {
    configuration: {
      'boolean-negation': false,
    },
  })

  if (isInCi) {
    noOutput = true
    noSpinner = true
  }

  // ESlint
  await executeCommand({
    title: 'ESlint',
    execute: async () => await $`npx eslint --color --cache --fix --cache-location .eslintcache .`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Markdown
  await executeCommand({
    title: 'Markdownlint',
    execute: async () => await $`esno ./src/lint/md.ts`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Secret
  await executeCommand({
    title: 'Secretlint',
    execute: async () => await $`npx secretlint --secretlintignore .gitignore \"**/*\"`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Size report
  !isInCi
    ? await executeCommand({
      title: 'Size report',
      execute: async () => await $`esno ./src/size/report.ts`,
      showOutput: !noOutput,
      showSpinner: !noSpinner,
    })
    : log.info('Size report linting process disabled in CI, because there is already task has in CI \'init\' job')

  // Spell
  await executeCommand({
    title: 'Spell check',
    execute: async () => await $`npx cspell ../`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Knip
  await executeCommand({
    title: 'Knip',
    execute: async () => await $`knip --no-gitignore --directory ../ --no-exit-code`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  outro(`${colors.cyan('All Set')}`)
}

main().catch(console.error)
