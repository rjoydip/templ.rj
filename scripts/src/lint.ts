import { intro, log, outro, spinner } from '@clack/prompts'
import { $ } from 'zx/core'
import colors from 'picocolors'

async function main() {
  const s = spinner()
  intro(`${colors.cyan('Linting')}`)
  s.start('ESlint ')
  const output = await $`eslint --color --cache --fix --cache-location .eslintcache .`
  s.stop('ESlint done')
  if (output)
    log.message(String(output))

  outro(`${colors.cyan('All Set')}`)
}

main().catch(console.error)
