import { platform } from 'node:os'
import { basename, resolve } from 'node:path'
import { argv, exit } from 'node:process'
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
import { $ } from 'zx'
import { getRootAsync } from '../utils'
import appsPrompt, { type AppsOptsType, defaultAppsOpts } from './apps'
import docsPrompt, { type DocsOptsType, defaultDocsOpts } from './docs'
import pkgsPrompt, { type PkgsOptsType, defaultPkgsOpts } from './pkgs'

interface CreateOptionsType {
  type: symbol | string
  apps: AppsOptsType
  docs: DocsOptsType
  pkgs: PkgsOptsType
}

interface OptionsType {
  create: CreateOptionsType
  packageManager: string
  install: boolean
}

enum CreateType {
  APPS = 'apps',
  DOCS = 'docs',
  PKGS = 'pkgs',
  CUSTOM = 'custom',
}

const s = spinner()

async function main() {
  $.verbose = false
  try {
    const { dryRun } = parser(argv.splice(2), {
      configuration: {
        'boolean-negation': false,
      },
    })

    intro('Create Scripts')

    let options: OptionsType = {
      create: {
        docs: defaultDocsOpts,
        pkgs: defaultPkgsOpts,
        apps: defaultAppsOpts,
        type: '',
      },
      packageManager: 'pnpm',
      install: false,
    }

    options = await group(
      {
        create: async () => {
          let opts = {}
          const options: CreateOptionsType = {
            type: 'pkgs',
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
            ],
            initialValue: 'pkgs',
          })

          options.type = type

          if (type === 'apps')
            opts = await appsPrompt()

          if (type === 'docs')
            opts = await docsPrompt()

          if (type === 'pkgs')
            opts = await pkgsPrompt()

          return { ...options, ...opts }
        },
        packageManager: async () => {
          if (options.create.docs.tools !== 'vitepress') {
            return await select<any, string>({
              message: 'Select package manager.',
              options: [
                { value: 'bun', label: 'Bun' },
                { value: 'npm', label: 'NPM' },
                { value: 'pnpm', label: 'PNPM' },
                { value: 'yarn', label: 'YARN' },
              ],
            })
          }
          return Promise.resolve('pnpm')
        },
        install: async () => {
          if (options.create.docs.tools !== 'vitepress') {
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
      console.log(JSON.stringify(options, null, 4))
      return 0
    }

    await create(options)

    outro('All set')

    exit(0)
  }
  catch (error) {
    s.stop(String(error ?? ''))
    throw error
  }
}

main().catch(console.error)

async function create(options: OptionsType) {
  const root = await getRootAsync()
  const { install, packageManager } = options
  const { docs, pkgs, type } = options?.create

  if (type === CreateType.PKGS)
    await createPackage(root, packageManager, install, pkgs)

  if (type === CreateType.DOCS)
    await createDoc(root, packageManager, install, docs)

  return void 0
}

async function createPackage(root: string, packageManager: string, install: boolean = false, pkgs: PkgsOptsType) {
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
    const s = spinner()
    s.start(`Installing via ${packageManager}`)
    await installDependencies({
      cwd: dest,
      packageManager: {
        name: packageManager as 'pnpm' || 'bun' || 'npm' || 'yarn',
        command: packageManager === 'npm' ? 'npm install' : `${packageManager}`,
      },
      silent: true,
    })
    s.stop(`Installed via ${packageManager}`)
  }

  note(`cd ${dest}\n${install ? `${packageManager} dev` : `${packageManager} install\n${packageManager} dev`}`, 'Next steps.')

  log.success(`${colors.green($basename)} package created`)
}

async function createDoc(root: string, packageManager: string, install: boolean = false, docs: DocsOptsType) {
  const { tools, docusaurus, nextra } = docs

  if (tools === 'docusaurus') {
    const { name, language, path, gitStrategy } = docusaurus
    s.start(`Creating ${name.toString()} documentation`)
    await $`npx create-docusaurus@latest ${name} classic ${platform() === 'win32' ? resolve(root, path.toString()).replace(/\\/g, '\\\\') : resolve(root, path.toString())} ${language === 'ts' ? '-t' : ''} ${!install ? '-s' : ''} -p ${packageManager} -g ${gitStrategy}`
    s.stop(`Generated ${name.toString()} documentation`)
  }

  if (tools === 'nextra') {
    const { name, theme, path } = nextra
    const dest = resolve(root, path.toString(), basename(name.toString()))
    const pkgVersion = await latestVersion(packageManager)

    await cpy(resolve(root, 'templates', 'nextra', `${theme.toString()}`, '**'), dest)

    if (theme.toString() !== 'swr') {
      replace({
        regex: `example-${theme.toString()}`,
        replacement: name,
        paths: [resolve(dest, 'package.json'), resolve(dest, 'README.md')],
        recursive: true,
        silent: true,
      })
    }
    else {
      replace({
        regex: 'swr-site',
        replacement: name,
        paths: [resolve(dest, 'package.json'), resolve(dest, 'README.md')],
        recursive: true,
        silent: true,
      })
    }

    replace({
      regex: '"packageManager": ""',
      replacement: `"packageManager": "${packageManager.concat(`@${pkgVersion}`)}"`,
      paths: [resolve(dest, 'package.json')],
      recursive: true,
      silent: true,
    })

    if (install) {
      const s = spinner()
      s.start(`Installing via ${packageManager}`)
      await installDependencies({
        cwd: dest,
        packageManager: {
          name: packageManager as 'pnpm' || 'bun' || 'npm' || 'yarn',
          command: packageManager === 'npm' ? 'npm install' : `${packageManager}`,
        },
        silent: true,
      })
      s.stop(`Installed via ${packageManager}`)
    }

    note(`cd ${dest}\n${install ? `${packageManager} dev` : `${packageManager} install\n${packageManager} dev`}`, 'Next steps.')

    log.success(`${colors.green(basename(name.toString()))} package created`)
  }
}
