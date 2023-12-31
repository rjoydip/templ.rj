import { argv, exit } from 'node:process'
import { cancel, confirm, group, select } from '@clack/prompts'
import parser from 'yargs-parser'
import type { AppsOptsType } from './apps'
import appsPrompt, { defaultAppsOpts } from './apps'

async function main() {
  const { dryRun } = parser(argv.splice(2), {
    configuration: {
      'boolean-negation': false,
    },
  })
  const $options = await group(
    {
      create: async () => {
        let options: {
          type: symbol | string
          apps: AppsOptsType
        } = {
          type: '',
          apps: defaultAppsOpts,
        }
        const type = await select<any, string>({
          message: 'Select what you want to create.',
          options: [
            { value: 'apps', label: 'Application' },
            { value: 'docs', label: 'Documentation' },
            { value: 'pkg', label: 'Packages' },
            { value: 'custom', label: 'Custom' },
          ],
          initialValue: 'custom',
        })

        options.type = type

        if (type === 'apps') {
          const appsOptions = await appsPrompt()
          options = {
            ...options,
            ...appsOptions,
          }
        }
        if (type === 'docs')
          return type
        if (type === 'custom')
          return type

        return options
      },
      packageManager: () => select<any, string>({
        message: 'Select package manager.',
        options: [
          { value: 'bun', label: 'Bun' },
          { value: 'npm', label: 'NPM' },
          { value: 'pnpm', label: 'PNPM' },
          { value: 'yarn', label: 'YARN' },
        ],
      }),
      install: () => confirm({
        message: 'Install dependencies?',
        initialValue: false,
      }),
    },
    {
      onCancel: () => {
        cancel('Operation cancelled.')
        exit(0)
      },
    },
  )

  if (dryRun) {
    console.log(JSON.stringify({
      options: $options,
    }, null, 4))
  }
}

main().catch(console.error)
