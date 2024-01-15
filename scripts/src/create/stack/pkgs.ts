import { basename, resolve } from 'node:path'
import { cp, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { exit } from 'node:process'
import { cancel, confirm, group, select, text } from '@clack/prompts'
import { installDependencies } from 'nypm'
import colors from 'picocolors'
import { downloadTemplate } from 'giget'
import { stackNotes, updateTemplateAssets } from '../../utils'
import type { SpinnerType } from '.'

export interface PkgsOptsType {
  path: symbol | string
  template: symbol | string
  remote: {
    repo: symbol | string
  }
  local: {
    name: symbol | string
    language: symbol | string
  }
}

export const defaultPkgsOpts = {
  path: '',
  template: '',
  remote: {
    repo: '',
  },
  local: {
    name: '',
    language: '',
  },
}

export async function create(root: string, packageManager: string, install: boolean = false, spinner: SpinnerType, pkgs: PkgsOptsType) {
  const { template, path } = pkgs
  const { repo } = pkgs.remote
  const { name, language } = pkgs.local
  const appPath = repo ? basename(repo.toString()) : name.toString()
  const dest = resolve(root, path.toString(), appPath)
  spinner.start(`Creating ${name.toString()} package`)

  if (!existsSync(dest))
    await mkdir(dest, { recursive: true })

  if (template === 'remote') {
    await downloadTemplate(repo.toString(), {
      dir: dest,
      preferOffline: true,
      install,
    })
  }

  if (template === 'local') {
    await cp(resolve(root, 'templates', `basic-${language.toString()}`), dest, {
      recursive: true,
    })
    await updateTemplateAssets(`@templ/${name.toString()}`, packageManager, dest, {
      from: `basic-${language.toString()}`,
      to: name.toString(),
    })
    if (install) {
      await installDependencies({
        cwd: dest,
        packageManager: {
          name: packageManager as 'pnpm' || 'bun' || 'npm' || 'yarn',
          command: packageManager === 'npm' ? 'npm install' : `${packageManager}`,
        },
        silent: true,
      })
    }
  }

  spinner.stop(`Generated ${name.toString()} package`)

  stackNotes(appPath, install, packageManager)
}

export async function init() {
  return await group(
    {
      pkg: async () => {
        const opts: PkgsOptsType = defaultPkgsOpts
        opts.path = await text({
          message: `Where should we create your ${colors.cyan('package')}?`,
          placeholder: './packages',
          validate: (value: string) => {
            if (!value)
              return 'Please enter a path.'
            if (value[0] !== '.')
              return 'Please enter a relative path.'
            return void (0)
          },
        })

        const templateOpts = await select<any, string>({
          message: 'Select a host below',
          options: [
            { value: 'remote', label: 'Remote' },
            { value: 'local', label: 'Local' },
          ],
          initialValue: 'local',
        })

        opts.template = templateOpts

        if (templateOpts === 'remote') {
          opts.remote.repo = await text({
            message: `Enter a repository URL.`,
            placeholder: `github:username/repo[/subpath][#ref]`,
            validate: (value: string) => {
              if (!value)
                return 'Please enter a URL.'
              return void (0)
            },
          })
        }

        if (templateOpts === 'local') {
          const langOpts = await confirm({
            message: 'Would you like to use TypeScript?',
            initialValue: false,
          })

          opts.local.language = langOpts ? 'ts' : 'js'

          opts.local.name = await text({
            message: `What is your ${colors.cyan('package')} name?`,
            placeholder: '',
            validate: (value: string) => {
              if (!value)
                return 'Please enter a name.'
              return void (0)
            },
          })
        }
      },
    },
    {
      onCancel: () => {
        cancel('Operation cancelled.')
        exit(0)
      },
    },
  )
}
