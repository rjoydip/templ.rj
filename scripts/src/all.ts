import { root } from '@templ/utils'
import { execCmd } from './utils'

async function main() {
  await execCmd('pnpm install', {
    msg: 'Installation',
    cwd: root,
  })

  await execCmd('pnpm clean', {
    msg: 'Cleanup',
    cwd: root,
  })

  await execCmd('pnpm changelog', {
    msg: 'Changelog update',
    cwd: root,
  })

  await execCmd('pnpm build', {
    msg: 'Build',
    cwd: root,
  })

  await execCmd('pnpm lint:md', {
    msg: 'Linting',
  })

  await execCmd('pnpm -C scripts size:generate', {
    msg: 'Size generate',
    cwd: root,
  })

  await execCmd('pnpm test', {
    msg: 'Unit testing',
    cwd: root,
  })

  await execCmd('pnpm test:cli', {
    msg: 'Cli testing',
    cwd: root,
  })

  await execCmd('pnpm system:info', {
    msg: 'System info',
    cwd: root,
  })

  await execCmd('pnpm update:third_party', {
    msg: 'Update third party git',
    cwd: root,
  })
}

main()
