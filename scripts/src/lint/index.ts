import { argv } from 'node:process'
import { resolve } from 'node:path'
import { intro, log, outro } from '@clack/prompts'
import parser from 'yargs-parser'
import isInCi from 'is-in-ci'
import colors from 'picocolors'
import { getRootDirAsync, getWrappedStr } from '@templ/utils'
import { exeCmd, executeFn } from '../utils'
import { getTypeCoverageResults } from './type-cov'

async function main() {
  intro(`${colors.cyan('Linting')}`)

  const root = await getRootDirAsync()

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
  await exeCmd({
    title: 'ESlint',
    cmd: `npx eslint -c ${resolve(root, 'eslint.config.js')} --color --cache --fix --cache-location .eslintcache .`,
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Markdown
  await exeCmd({
    title: 'Markdownlint',
    cmd: 'npx tsx ./src/lint/markdown.ts',
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

  // Size report
  !isInCi
    ? await exeCmd({
      title: 'Size report',
      cmd: 'npx tsx ./src/size/report.ts',
      showOutput: !noOutput,
      showSpinner: !noSpinner,
    })
    : log.info(getWrappedStr('Size report linting process disabled in CI, because there is already task has in CI \'init\' job'))

  outro(`${colors.cyan('All Set')}`)
}

main().catch(console.error)
