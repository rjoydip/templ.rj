import { cwd } from 'node:process'
import { existsSync } from 'node:fs'
import { cp, mkdir } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { downloadTemplate } from 'giget'
import { colors } from 'consola/utils'
import consola from 'consola'
import { installDependencies } from 'nypm'
import { type PM, getPkgManagers, hasDryRun, stackNotes, updateTemplateAssets } from '../utils'

interface PkgOptsType {
  path: string
  template: string
  pkgManager: PM
  install: boolean
  remote: {
    repo: string
  }
  local: {
    name: string
    language: string
  }
}

async function main() {
  const root = resolve(cwd(), '..')
  const pkgOpts: PkgOptsType = {
    path: './packages',
    template: 'Local',
    remote: {
      repo: 'github:username/repo',
    },
    local: {
      name: 'package',
      language: 'ts',
    },
    pkgManager: 'npm',
    install: true,
  }

  pkgOpts.path = await consola.prompt(`Where should we create your ${colors.cyan(pkgOpts.local.name)}?`, {
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

  pkgOpts.pkgManager = await consola.prompt('Select package manager.', {
    type: 'select',
    options: (await getPkgManagers()).map((pm: string) => pm.toUpperCase()),
    initial: pkgOpts.pkgManager,
  }) as PM

  pkgOpts.install = await consola.prompt('Do you want to install dependencies?', {
    type: 'confirm',
    initial: true,
  })

  if (hasDryRun()) {
    consola.box(pkgOpts)
    return
  }

  const { template, path, remote, pkgManager, install, local } = pkgOpts

  if (template === 'Remote') {
    consola.start(`Creating ${basename(remote.repo)} package`)
    const dest = resolve(root, path, basename(remote.repo))
    if (!existsSync(dest))
      await mkdir(dest, { recursive: true })
    await downloadTemplate(remote.repo, {
      dir: dest,
      install,
    })
    consola.success(`Generated ${basename(remote.repo)} package`)
    stackNotes(dest, install, pkgManager)
  }

  if (template === 'Local') {
    consola.start(`Creating ${local.name} package`)
    const dest = resolve(root, path, local.name)
    await cp(resolve(root, 'templates', `basic-${local.language}`), dest, {
      recursive: true,
      force: true,
    })
    await updateTemplateAssets({
      name: `@templ/${local.name}`,
      pkgManager,
      root,
      dest,
      replacement: {
        from: `basic-${local.language}`,
        to: local.name,
      },
    })
    if (install) {
      await installDependencies({
        cwd: dest,
        packageManager: {
          name: pkgManager as PM,
          command: pkgManager === 'npm' ? 'npm install' : `${pkgManager}`,
        },
        silent: true,
      })
    }

    consola.success(`Generated ${local.name} package`)
    stackNotes(dest, install, pkgManager)
  }
}

main().catch(consola.error)
