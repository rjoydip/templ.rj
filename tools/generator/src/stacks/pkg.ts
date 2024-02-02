import { cwd } from 'node:process'
import { cp } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import consola from 'consola'
import { colors } from 'consola/utils'
import { installDependencies } from 'nypm'
import type { PM } from '../utils'
import { downloadTemplate, getPkgManagers, hasDryRun, stackNotes, updateTemplateAssets } from '../utils'

interface PkgOptsType {
  path: string
  template: string
  pm: PM
  install: boolean
  remote: {
    repo: string
  }
  local: {
    name: string
    language: string
  }
}

export async function run() {
  const root = resolve(cwd(), '..', '..')
  const pkgOpts: PkgOptsType = {
    path: '',
    template: '',
    remote: {
      repo: 'github:username/repo',
    },
    local: {
      name: '',
      language: 'ts',
    },
    pm: 'npm',
    install: true,
  }

  pkgOpts.path = await consola.prompt(`Where should we generate your ${colors.cyan(pkgOpts.local.name)}?`, {
    type: 'text',
    initial: pkgOpts.path,
    default: pkgOpts.path,
    placeholder: pkgOpts.path,
  })

  pkgOpts.template = await consola.prompt(`Select a ${colors.cyan(pkgOpts.local.name)} tyoe.`, {
    type: 'select',
    options: [
      'Remote',
      'Local',
    ],
    initial: pkgOpts.template,
  })
  if (pkgOpts.template === 'Remote') {
    pkgOpts.remote.repo = await consola.prompt('`Enter a repository URL.', {
      type: 'text',
      default: pkgOpts.remote.repo,
      placeholder: pkgOpts.remote.repo,
      initial: pkgOpts.remote.repo,
    })
  }

  if (pkgOpts.template === 'Local') {
    const language = await consola.prompt('Would you like to use TypeScript?', {
      type: 'confirm',
      initialValue: true,
    })

    pkgOpts.local.language = language ? 'ts' : 'js'

    pkgOpts.local.name = await consola.prompt(`What is your ${colors.cyan(pkgOpts.local.name)} name?`, {
      type: 'text',
      default: pkgOpts.local.name,
      placeholder: pkgOpts.local.name,
      initial: pkgOpts.local.name,
    })
  }

  pkgOpts.pm = await consola.prompt('Select package manager.', {
    type: 'select',
    options: (await getPkgManagers()).map((pm: string) => pm.toUpperCase()),
    initial: pkgOpts.pm,
  }) as PM

  pkgOpts.install = await consola.prompt('Do you want to install dependencies?', {
    type: 'confirm',
    initial: true,
  })

  if (hasDryRun()) {
    consola.box(pkgOpts)
    return
  }

  const { template, path, remote, pm, install, local } = pkgOpts

  if (template === 'Remote') {
    consola.start(`\nCreating ${colors.cyan(basename(remote.repo))} package\n`)
    const dir = resolve(root, path, basename(remote.repo))

    await downloadTemplate({
      repo: remote.repo,
      dtOps: {
        dir,
        install,
      },
    })
    consola.success(`Generated ${colors.cyan(basename(remote.repo))} package`)
    stackNotes(dir, install, pm)
  }

  if (template === 'Local') {
    consola.start(`\nCreating ${colors.cyan(local.name)} package\n`)
    const dir = resolve(root, path, local.name)
    await cp(resolve(cwd(), 'templates', `basic-${local.language}`), dir, {
      recursive: true,
      force: true,
    })
    await updateTemplateAssets({
      name: `@templ/${local.name}`,
      pm,
      root,
      dir,
      replacement: {
        from: `basic-${local.language}`,
        to: local.name,
      },
    })
    if (install) {
      await installDependencies({
        cwd: dir,
        packageManager: {
          name: pm as PM,
          command: pm === 'npm' ? 'npm install' : `${pm}`,
        },
        silent: true,
      })
    }

    consola.success(`Generated ${colors.cyan(local.name)} package`)
    stackNotes(dir, install, pm)
  }
}

run().catch(consola.error)
