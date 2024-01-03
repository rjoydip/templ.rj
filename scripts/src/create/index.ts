import { argv, exit } from 'node:process'
import { cancel, confirm, group, intro, outro, select } from '@clack/prompts'
import parser from 'yargs-parser'
import type { AppsOptsType } from './apps'
import type { DocsOptsType } from './docs'
import type { PkgsOptsType } from './pkgs'
import appsPrompt, { defaultAppsOpts } from './apps'
import docsPrompt, { defaultDocsOpts } from './docs'
import pkgsPrompt, { defaultPkgsOpts } from './pkgs'

async function main() {
  const { dryRun } = parser(argv.splice(2), {
    configuration: {
      'boolean-negation': false,
    },
  })

  intro('Create Scripts')

  const $options = await group(
    {
      create: async () => {
        let options: {
          type: symbol | string
          apps: AppsOptsType
          docs: DocsOptsType
          pkgs: PkgsOptsType
        } = {
          type: '',
          apps: defaultAppsOpts,
          docs: defaultDocsOpts,
          pkgs: defaultPkgsOpts,
        }
        const type = await select<any, string>({
          message: 'Select what you want to create.',
          options: [
            { value: 'apps', label: 'Application' },
            { value: 'docs', label: 'Documentation' },
            { value: 'pkgs', label: 'Packages' },
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
        if (type === 'docs') {
          const docsOptions = await docsPrompt()
          options = {
            ...options,
            ...docsOptions,
          }
        }
        if (type === 'pkgs') {
          const pkgsOptions = await pkgsPrompt()
          options = {
            ...options,
            ...pkgsOptions,
          }
        }
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

  if (dryRun)
    console.log(JSON.stringify($options, null, 4))

  outro('All set')
}

main().catch(console.error)
