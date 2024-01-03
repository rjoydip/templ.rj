import { argv, exit } from 'node:process'
import { basename, resolve } from 'node:path'
import { cancel, confirm, group, intro, log, note, outro, select, spinner } from '@clack/prompts'
import cpy from 'cpy'
import {
  installDependencies,
} from 'nypm'
import colors from 'picocolors'
import replace from 'replace'
import gittar from 'gittar'
import latestVersion from 'latest-version'
import parser from 'yargs-parser'
import { getRootAsync } from 'src/utils'
import type { AppsOptsType } from './apps'
import type { CustomOptsType } from './custom'
import type { DocsOptsType } from './docs'
import type { PkgsOptsType } from './pkgs'
import appsPrompt, { defaultAppsOpts } from './apps'
import customPrompt, { defaultCustomOpts } from './custom'
import docsPrompt, { defaultDocsOpts } from './docs'
import pkgsPrompt, { defaultPkgsOpts } from './pkgs'

interface CreateOptionsType {
  type: symbol | string
  apps: AppsOptsType
  custom: CustomOptsType
  docs: DocsOptsType
  pkgs: PkgsOptsType
}

interface OptionsType {
  create: CreateOptionsType
  packageManager: PackageManagerName
  install: boolean
}

enum CreateType {
  APPS = 'apps',
  DOCS = 'docs',
  PKGS = 'pkgs',
  CUSTOM = 'custom',
}

type PackageManagerName = 'npm' | 'yarn' | 'pnpm' | 'bun'

async function main() {
  const { dryRun } = parser(argv.splice(2), {
    configuration: {
      'boolean-negation': false,
    },
  })

  intro('Create Scripts')

  const $options: OptionsType = await group(
    {
      create: async () => {
        let opts = {}
        const options: CreateOptionsType = {
          type: '',
          apps: defaultAppsOpts,
          custom: defaultCustomOpts,
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

        if (type === 'apps')
          opts = await appsPrompt()

        if (type === 'docs')
          opts = await docsPrompt()

        if (type === 'pkgs')
          opts = await pkgsPrompt()

        if (type === 'custom')
          opts = await customPrompt()

        return { ...options, ...opts }
      },
      packageManager: () => select<any, PackageManagerName>({
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
    console.log(JSON.stringify($options, null, 4))
    return void 0
  }

  await create($options)

  outro('All set')

  exit(0)
}

main().catch(console.error)

async function create(options: OptionsType) {
  const { install, packageManager } = options
  const { pkgs, type } = options.create
  const root = await getRootAsync()

  if (type === CreateType.PKGS) {
    const name = pkgs.remote.repo ? basename(pkgs.remote.repo.toString()) : pkgs.local.name.toString()
    const dest = resolve(root, pkgs.path.toString(), name)

    if (pkgs.template === 'remote') {
      await gittar.fetch(pkgs.remote.repo.toString(), { hostname: pkgs.remote.hostname })
      await gittar.extract(pkgs.remote.repo.toString(), dest)
    }

    if (pkgs.template === 'local') {
      const pkgVersion = await latestVersion(packageManager)

      await cpy(`${resolve(root, 'templates', `${pkgs.local.language.toString()}`)}-basic/**`, dest)

      replace({
        regex: `${pkgs.local.language.toString()}-basic`,
        replacement: pkgs.local.name,
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
      const s = spinner()
      s.start(`Installing via ${packageManager}`)
      await installDependencies({
        cwd: dest,
        packageManager: {
          name: packageManager,
          command: packageManager === 'npm' ? 'npm install' : `${packageManager}`,
        },
        silent: true,
      })
      s.stop(`Installed via ${packageManager}`)
    }

    note(`cd ${dest}\n${install ? `${packageManager} dev` : `${packageManager} install\n${packageManager} dev`}`, 'Next steps.')

    log.success(`${colors.green(name)} package created`)
  }

  return void 0
}
