import { execCmd } from '../utils'

async function main() {
  await execCmd('pnpm lint:eslint', {
    msg: 'ESlint',
  })

  await execCmd('pnpm lint:md', {
    msg: 'Markdownlint',
  })

  await execCmd('pnpm lint:secret', {
    msg: 'Secret lint',
  })

  await execCmd('size-limit', {
    msg: 'Size limit',
  })

  await execCmd('pnpm lint:spell', {
    msg: 'Spell lint',
  })

  await execCmd('pnpm knip --no-gitignore --no-exit-code', {
    msg: 'Knip',
  })
}

main()
