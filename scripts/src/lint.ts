import { execCmd } from './utils'

async function main() {
  await execCmd('eslint --color --cache --fix --cache-location .eslintcache .', {
    msg: 'ESlint',
  })

  await execCmd('pnpm -C scripts lint:md', {
    msg: 'Markdownlint',
  })

  await execCmd('secretlint --secretlintignore .gitignore \"**/*\"', {
    msg: 'Secret lint',
  })

  await execCmd('size-limit', {
    msg: 'Size limit',
  })

  await execCmd('cspell .', {
    msg: 'Spell lint',
  })

  await execCmd('pnpm knip --no-gitignore --no-exit-code', {
    msg: 'Knip',
  })
}

main()
