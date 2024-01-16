import { argv } from 'node:process'
import { resolve } from 'node:path'
import { intro, outro } from '@clack/prompts'
import parser from 'yargs-parser'
import isInCi from 'is-in-ci'
import colors from 'picocolors'
import { sizeLimit, sizeLimitRenderer } from '../size/limit'
import { sizeReportRenderer } from '../size/report'
import { exeCmd, executeFn, getRootDirAsync } from '../utils'
import { typeCov, typeCovRenderer } from './type-cov'

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

  // Type coverage
  await executeFn({
    title: 'Type Coverage',
    fn: async () => {
      const results = await typeCov()
      typeCovRenderer(results)
    },
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Size limit
  await executeFn({
    title: 'Size limit',
    fn: async () => {
      const results = await sizeLimit()
      sizeLimitRenderer(results)
    },
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  // Size report
  await executeFn({
    title: 'Size report',
    fn: async () => {
      await sizeReportRenderer()
    },
    showOutput: !noOutput,
    showSpinner: !noSpinner,
  })

  outro(`${colors.cyan('All Set')}`)
}

main().catch(console.error)
