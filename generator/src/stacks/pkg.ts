import { cwd } from 'node:process'
import { basename, resolve } from 'node:path'
import { cp } from 'node:fs/promises'
import consola from 'consola'
import { colors } from 'consola/utils'
import { globby } from 'globby'
import { downloadTemplate, hasDryRun, stackNotes, updateTemplateAssets, vitestConfigPathModification } from '../utils'

interface PkgOptsType {
  path: string
  template: string
  remote: {
    repo: string
  }
  local: {
    name: string
    language: string
  }
}

export async function run() {
  const root = resolve(cwd(), '..')
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
  }

  pkgOpts.path = await consola.prompt(`Where should we generate your package?`, {
    type: 'text',
    initial: pkgOpts.path,
    default: pkgOpts.path,
    placeholder: pkgOpts.path,
  })

  pkgOpts.template = await consola.prompt(`Select a package type.`, {
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

    pkgOpts.local.name = await consola.prompt(`What is your package name?`, {
      type: 'text',
      default: pkgOpts.local.name,
      placeholder: pkgOpts.local.name,
      initial: pkgOpts.local.name,
    })
  }

  if (hasDryRun()) {
    consola.box(pkgOpts)
    return
  }

  const { template, path, remote, local } = pkgOpts

  if (template === 'Remote') {
    consola.start(`Creating ${colors.cyan(basename(remote.repo))} package\n`)
    const dir = resolve(root, path, basename(remote.repo))

    await downloadTemplate({
      repo: remote.repo,
      dtOps: {
        dir,
        install: false,
      },
    })
    consola.success(`Generated ${colors.cyan(basename(remote.repo))} package`)
    stackNotes({ path: dir })
  }

  if (template === 'Local') {
    consola.start(`Creating ${colors.cyan(local.name)} package\n`)
    const dir = resolve(root, path, local.name)
    const sourceDir = resolve('templates', `basic-${local.language}`)
    const filesToCopy = await globby(['**/*'], {
      ignore: ['**/coverage/**', '**/dist/**', '!**/node_modules/**'],
      cwd: sourceDir,
    })

    await Promise.all(
      filesToCopy.map(file => cp(resolve(sourceDir, file), resolve(dir, file), { recursive: true, force: true })),
    )

    await updateTemplateAssets({
      name: `@templ/${local.name}`,
      pm: 'pnpm',
      root,
      dir,
      replacement: {
        from: `basic-${local.language}`,
        to: local.name,
      },
    })

    await vitestConfigPathModification({
      path: dir,
      lang: local.language,
    })

    consola.success(`Generated ${colors.cyan(local.name)} package`)
    stackNotes({ path: dir })
  }
}

run().catch(consola.error)
