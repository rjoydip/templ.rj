import { resolve } from 'node:path'
import { platform } from 'node:os'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { exit } from 'node:process'
import { cancel, confirm, group, log, note, select, text } from '@clack/prompts'
import latestVersion from 'latest-version'
import replace from 'replace'
import colors from 'picocolors'
import { downloadTemplate } from 'giget'
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
    language: '',
    theme: '',
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
    const $path = platform() === 'win32' ? resolve(root, path.toString()).replace(/\\/g, '\\\\') : resolve(root, path.toString())
    await $`npx create-docusaurus@latest ${name.toString()} classic ${$path} ${language === 'ts' ? '-t' : ''} ${!install ? '-s' : ''} -p ${packageManager} -g ${gitStrategy}`
    spinner.stop(`Generated ${name.toString()} documentation`)
  }

  if (tools === 'nextra') {
    const { name, theme, path } = nextra
    spinner.start(`Creating ${name.toString()} documentation`)

    const dest = resolve(root, path.toString(), name.toString())
    const pkgVersion = await latestVersion(packageManager)

    if (!existsSync(dest))
      await mkdir(dest, { recursive: true })

    await downloadTemplate(`github:shuding/nextra/examples/${theme.toString()}`, {
      dir: dest,
      preferOffline: true,
      install,
    })

    const docPkgJSONPath = resolve(dest, 'package.json')

    if (existsSync(docPkgJSONPath)) {
      replace({
        regex: theme.toString() !== 'swr' ? `@templ/${theme.toString()}` : 'swr-site',
        replacement: name,
        paths: [docPkgJSONPath],
        recursive: true,
        silent: true,
      })

      replace({
        regex: '"packageManager": ""',
        replacement: `"packageManager": "${packageManager.concat(`@${pkgVersion}`)}"`,
        paths: [docPkgJSONPath],
        recursive: true,
        silent: true,
      })
      spinner.stop(`Generated ${name.toString()} documentation`)

      note(`cd ${dest}\n${install ? `${packageManager} dev` : `${packageManager} install\n${packageManager} dev`}`, 'Next steps.')
      log.success(`${colors.green(name.toString())} package created`)
    }
    else {
      spinner.stop(colors.red('Error: Docs folder creation'))
    }
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
            placeholder: './docs',
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
    {
      onCancel: () => {
        cancel('Operation cancelled.')
        exit(0)
      },
    },
  )
}
