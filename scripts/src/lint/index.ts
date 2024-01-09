import { argv } from 'node:process'
import { intro, log, outro } from '@clack/prompts'
import parser from 'yargs-parser'
import { $ } from 'zx'
import isInCi from 'is-in-ci'
import { executeCommand, executeFn } from 'src/utils'
import colors from 'picocolors'
import { getTypeCoverageResults } from './type-cov'

async function main() {
  $.verbose = false
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
    execute: async () => await $`node --import tsx/esm ./src/lint/markdown.ts`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Type coverage
  await executeFn<string>({
    title: 'Type Coverage',
    fn: getTypeCoverageResults,
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
      execute: async () => await $`node --import tsx/esm ./src/size/report.ts`,
      showOutput: !noOutput,
      showSpinner: !noSpinner,
    })
    : log.info('Size report linting process disabled in CI, because there is already task has in CI \'init\' job')

  // Spell
  await executeCommand({
    title: 'Spell check',
    execute: async () => await $`npx cspell ../ --quiet`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  outro(`${colors.cyan('All Set')}`)
}

main().catch(console.error)
