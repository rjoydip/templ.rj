import { basename, resolve } from 'node:path'
import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { exit } from 'node:process'
import { cancel, confirm, group, log, note, select, text } from '@clack/prompts'
import cpy from 'cpy'
import replace from 'replace'
import gittar from 'gittar'
import latestVersion from 'latest-version'
import { installDependencies } from 'nypm'
import colors from 'picocolors'
import type { SpinnerType } from '.'

export interface PkgsOptsType {
  path: symbol | string
  template: symbol | string
  remote: {
    hostname: symbol | string
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
    hostname: '',
    repo: '',
  },
  local: {
    name: '',
    language: '',
  },
}

export async function create(root: string, packageManager: string, install: boolean = false, spinner: SpinnerType, pkgs: PkgsOptsType) {
  const { template, path } = pkgs
  const { hostname, repo } = pkgs.remote
  const { name, language } = pkgs.local
  const $basename = repo ? basename(repo.toString()) : name.toString()
  const dest = resolve(root, path.toString(), $basename)

  if (template === 'remote') {
    await gittar.fetch(repo.toString(), { hostname })
    await gittar.extract(repo.toString(), dest)
  }

  if (template === 'local') {
    const pkgVersion = await latestVersion(packageManager)

    if (!existsSync(dest))
      await mkdir(dest)

    await cpy(resolve(root, 'templates', 'basic', `${language.toString()}`, '**'), dest)

    replace({
      regex: `${language.toString()}`,
      replacement: name,
      paths: [resolve(dest, 'package.json'), resolve(dest, 'README.md')],
      recursive: true,
      silent: true,
    })

    replace({
      regex: '"packageManager": ""',
      replacement: `"packageManager": "${packageManager.concat(`@${pkgVersion}`)}"`,
      paths: [resolve(dest, 'package.json')],
      recursive: true,
      silent: true,
    })
  }

  if (install) {
    spinner.start(`Installing via ${packageManager}`)
    await installDependencies({
      cwd: dest,
      packageManager: {
        name: packageManager as 'pnpm' || 'bun' || 'npm' || 'yarn',
        command: packageManager === 'npm' ? 'npm install' : `${packageManager}`,
      },
      silent: true,
    })
    spinner.stop(`Installed via ${packageManager}`)
  }

  note(`cd ${dest}\n${install ? `${packageManager} dev` : `${packageManager} install\n${packageManager} dev`}`, 'Next steps.')

  log.success(`${colors.green($basename)} package created`)
}

export async function init() {
  return await group(
    {
      pkg: async () => {
        const opts: PkgsOptsType = defaultPkgsOpts
        opts.path = await text({
          message: `Where should we create your ${colors.cyan('packages')}?`,
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
            { value: 'bitbucket', label: 'Bitbucket' },
            { value: 'github', label: 'Github' },
            { value: 'gitlab', label: 'Gitlab' },
            { value: 'local', label: 'Local' },
          ],
          initialValue: 'local',
        })

        opts.template = (templateOpts === 'github' || templateOpts === 'gitlab' || templateOpts === 'bitbucket') ? 'remote' : templateOpts

        if (opts.template === 'remote') {
          opts.remote.hostname = templateOpts
          opts.remote.repo = await text({
            message: `Enter a repository URL.`,
            placeholder: `ownerName/repoName`,
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
            message: `What is your ${colors.cyan('packages')} name?`,
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
