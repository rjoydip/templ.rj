import { execCmd } from './utils.js'

async function main() {
  await execCmd('pnpm clean', {
    msg: 'Cleanup',
  })

  await execCmd('pnpm deps:update', {
    msg: 'Update dependency',
  })

  await execCmd('pnpm changelog', {
    msg: 'Changelog update',
  })

  await execCmd('pnpm build', {
    msg: 'Build',
  })

  await execCmd('pnpm lint', {
    msg: 'Linting',
  })

  await execCmd('pnpm -C scripts size:generate', {
    msg: 'Size generate',
  })

  await execCmd('pnpm test', {
    msg: 'Unit testing',
  })

  await execCmd('pnpm test:cli', {
    msg: 'Cli testing',
  })

  await execCmd('pnpm system:info', {
    msg: 'System info',
  })

  await execCmd('pnpm update:third_party', {
    msg: 'Update third party git',
  })
}

main()
