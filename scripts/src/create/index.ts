import { argv, exit } from 'node:process'
import { cancel, confirm, group, intro, log, outro, select, spinner } from '@clack/prompts'
import parser from 'yargs-parser'
import { getPackageManagers } from '../utils'
import type { CreateOptionsType, OptionsType } from './stack'
import { apps, createStack, docs, getCreateOpts, getDefaultOpts, pkgs } from './stack'

async function main() {
  const s = spinner()
  try {
    const { dryRun, stack } = parser(argv.splice(2), {
      configuration: {
        'boolean-negation': false,
      },
    })

    intro('Create Apps/Docs/Pkgs')

    if (stack) {
      let stackOpts: OptionsType = getDefaultOpts()

      stackOpts = await group(
        {
          create: async () => {
            let opts = {}
            const options: CreateOptionsType = getCreateOpts()
            const type = await select<any, string>({
              message: 'Select what you want to create.',
              options: [
                { value: 'apps', label: 'Application' },
                { value: 'docs', label: 'Documentation' },
                { value: 'pkgs', label: 'Package' },
              ],
              initialValue: 'pkgs',
            })

            options.type = type

            if (type === 'apps')
              opts = await apps.init()

            if (type === 'docs')
              opts = await docs.init()

            if (type === 'pkgs')
              opts = await pkgs.init()

            return { ...options, ...opts }
          },
          packageManager: async () => {
            if (stackOpts.create.docs.tools !== 'vitepress') {
              const availablePackageManagers = await getPackageManagers() || ['npm']
              return await select<any, string>({
                message: 'Select package manager.',
                options: availablePackageManagers.map((pm: string) => ({ value: pm, label: pm })),
              })
            }
            return Promise.resolve('pnpm')
          },
          install: async () => {
            if (stackOpts.create.docs.tools !== 'vitepress' || stackOpts.create.apps.type !== 'next') {
              return await confirm({
                message: 'Install dependencies?',
                initialValue: false,
              })
            }
            return Promise.resolve(false)
          },
        },
        {
          onCancel: () => {
            cancel('Operation cancelled.')
            s.stop()
            exit(0)
          },
        },
      )

      if (dryRun) {
        log.message(JSON.stringify(stackOpts, null, 4))
        return 0
      }

      await createStack(stackOpts)
    }
  }
  catch (error) {
    s.stop(String(error ?? ''))
    throw error
  }
  finally {
    outro('All set')
    exit(0)
  }
}

main().catch(console.error)
