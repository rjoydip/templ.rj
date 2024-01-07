import { basename, resolve } from 'node:path'
import { platform } from 'node:os'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { confirm, group, log, note, select, text } from '@clack/prompts'
import cpy from 'cpy'
import latestVersion from 'latest-version'
import replace from 'replace'
import { installDependencies } from 'nypm'
import colors from 'picocolors'
import { $ } from 'zx'
import type { SpinnerType } from '.'

export interface DocsOptsType {
  docusaurus: {
    name: symbol | string
    path: symbol | string
    language: symbol | string
    theme: symbol | string
    gitStrategy: symbol | string
  }
  tools: symbol | string
  nextra: {
    name: symbol | string
    path: symbol | string
    theme: symbol | string
  }
}

export const defaultDocsOpts = {
  docusaurus: {
    name: '',
    path: '',
    language: 'js',
    theme: 'docs',
    gitStrategy: '',
  },
  tools: '',
  nextra: {
    name: '',
    path: '',
    theme: '',
  },
}

export async function create(root: string, packageManager: string, install: boolean = false, spinner: SpinnerType, docs: DocsOptsType) {
  const { tools, docusaurus, nextra } = docs

  if (tools === 'docusaurus') {
    const { name, language, path, gitStrategy } = docusaurus
    spinner.start(`Creating ${name.toString()} documentation`)
    await $`npx create-docusaurus@latest ${name.toString()} classic ${platform() === 'win32' ? resolve(root, path.toString()).replace(/\\/g, '\\\\') : resolve(root, path.toString())} ${language === 'ts' ? '-t' : ''} ${!install ? '-s' : ''} -p ${packageManager} -g ${gitStrategy}`
    spinner.stop(`Generated ${name.toString()} documentation`)
  }

  if (tools === 'nextra') {
    const { name, theme, path } = nextra
    const dest = resolve(root, path.toString(), basename(name.toString()))
    const pkgVersion = await latestVersion(packageManager)

    if (!existsSync(dest))
      await mkdir(dest)
    await cpy(resolve(root, 'templates', 'nextra', `${theme.toString()}`, '**'), dest)

    if (theme.toString() !== 'swr') {
      replace({
        regex: `example-${theme.toString()}`,
        replacement: name,
        paths: [resolve(dest, 'package.json')],
        recursive: true,
        silent: true,
      })
    }
    else {
      replace({
        regex: 'swr-site',
        replacement: name,
        paths: [resolve(dest, 'package.json')],
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

    log.success(`${colors.green(basename(name.toString()))} package created`)
  }
}

export async function init() {
  return await group(
    {
      docs: async () => {
        const opts: DocsOptsType = defaultDocsOpts

        const toolsOpts = await select<any, string>({
          message: 'Select tools/framework.',
          options: [
            { value: 'docusaurus', label: 'Docusaurus' },
            { value: 'nextra', label: 'Nextra' },
          ],
          initialValue: 'nextra',
        })

        opts.tools = toolsOpts

        if (toolsOpts === 'docusaurus' || toolsOpts === 'nextra') {
          if (toolsOpts === 'nextra') {
            const themeOpts = await select<any, string>({
              message: 'Select a theme first',
              options: [
                { value: 'docs', label: 'Docs' },
                { value: 'blog', label: 'Blog' },
                { value: 'swr', label: 'SWR' },
              ],
              initialValue: 'docs',
            })

            opts[toolsOpts].theme = themeOpts
          }

          opts[toolsOpts].path = await text({
            message: `Where should we create your ${colors.cyan(opts[toolsOpts].theme.toString())}?`,
            placeholder: './',
            validate: (value: string) => {
              if (!value)
                return 'Please enter a path.'
              if (value[0] !== '.')
                return 'Please enter a relative path.'
              return void (0)
            },
          })

          const shouldDefaultName = await confirm({
            message: `Do you want to create with default ${colors.cyan(opts[toolsOpts].theme.toString())} name?`,
            initialValue: false,
          })
          if (!shouldDefaultName) {
            opts[toolsOpts].name = await text({
              message: `What is your ${colors.cyan(opts[toolsOpts].theme.toString())} name?`,
              placeholder: '',
              validate: (value: string) => {
                if (!value)
                  return 'Please enter a name.'
                return void (0)
              },
            })
          }
          else {
            opts[toolsOpts].name = opts[toolsOpts].theme.toString()
          }

          if (toolsOpts === 'docusaurus') {
            const langOpts = await confirm({
              message: 'Would you like to use TypeScript?',
              initialValue: false,
            })

            opts[toolsOpts].language = langOpts ? 'typescript' : 'javascript'

            const gitStrategyOpts = await select<any, string>({
              message: 'Select a theme first',
              options: [
                { value: 'deep', label: 'Preserve full history' },
                { value: 'shallow', label: 'Clone with --depth=1' },
                { value: 'copy', label: 'Shallow clone', hints: 'Not create a git repo' },
                { value: 'custom', label: 'Enter your custom git clone command', hints: 'We will prompt you for it' },
              ],
              initialValue: 'custom',
            })

            opts[toolsOpts].gitStrategy = gitStrategyOpts
          }
        }

        return opts
      },
    },
  )
}
