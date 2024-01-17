import { join, resolve, sep } from 'node:path'
import { platform } from 'node:os'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { exit } from 'node:process'
import { cancel, confirm, group, log, select, text } from '@clack/prompts'
import colors from 'picocolors'
import { downloadTemplate } from 'giget'
import latestVersion from 'latest-version'
import { stackNotes, updateTemplateAssets } from '../../utils'
import type { SpinnerType } from '.'

export interface DocsOptsType {
  docusaurus: {
    name: symbol | string
    path: symbol | string
    language: symbol | string
    theme: symbol | string
  }
  tools: symbol | string
  mintlify: {
    name: symbol | string
    path: symbol | string
  }
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
  },
  tools: '',
  mintlify: {
    name: '',
    path: '',
  },
  nextra: {
    name: '',
    path: '',
    theme: '',
  },
}

export async function create(root: string, packageManager: string, install: boolean = false, spinner: SpinnerType, docs: DocsOptsType) {
  const { tools, docusaurus, mintlify, nextra } = docs

  if (tools === 'docusaurus') {
    const { name, language, path } = docusaurus
    spinner.start(`Creating ${name.toString()} documentation`)

    const appPath = join(path.toString(), name.toString())
    const dest = platform() === 'win32' ? resolve(root, appPath.toString()).replace(sep, '\\\\') : resolve(root, appPath.toString())

    if (!existsSync(dest))
      await mkdir(dest, { recursive: true })

    await downloadTemplate(`github:shuding/nextra/examples/${(language ? 'classic-typescript' : 'classic').toString()}`, {
      dir: dest,
      preferOffline: true,
      install,
    })

    await updateTemplateAssets(`@templ/${name.toString()}`, packageManager, dest)

    spinner.stop(`Generated ${name.toString()} documentation`)

    stackNotes(appPath, install, packageManager)
    log.success(`${colors.green(name.toString())} package created`)
  }

  if (tools === 'mintlify') {
    const { name, path } = mintlify
    spinner.start(`Creating ${name.toString()} documentation`)

    const appPath = join(path.toString(), name.toString())
    const dest = platform() === 'win32' ? resolve(root, appPath.toString()).replace(sep, '\\\\') : resolve(root, appPath.toString())

    if (!existsSync(dest))
      await mkdir(dest, { recursive: true })

    await downloadTemplate('github:mintlify/starter', {
      dir: dest,
      preferOffline: true,
      install,
    })

    const mintilifyLV = await latestVersion('mintlify')

    await updateTemplateAssets(`@templ/${name.toString()}`, packageManager, dest, {}, {
      scripts: {
        dev: 'mintlify dev',
      },
      devDependencies: {
        mintilify: `^${mintilifyLV}`,
      },
    })

    spinner.stop(`Generated ${name.toString()} documentation`)

    stackNotes(appPath, install, packageManager)
    log.success(`${colors.green(name.toString())} package created`)
  }

  if (tools === 'nextra') {
    const { name, theme, path } = nextra
    spinner.start(`Creating ${name.toString()} documentation`)

    const appPath = join(path.toString(), name.toString())
    const dest = resolve(root, appPath.toString(), name.toString())

    if (!existsSync(dest))
      await mkdir(dest, { recursive: true })

    await downloadTemplate(`github:shuding/nextra/examples/${theme.toString()}`, {
      dir: dest,
      preferOffline: true,
      install,
    })

    await updateTemplateAssets(`@templ/${name.toString()}`, packageManager, dest)

    spinner.stop(`Generated ${name.toString()} documentation`)

    stackNotes(appPath, install, packageManager)
    log.success(`${colors.green(name.toString())} package created`)
  }
}

export async function init() {
  return await group(
    {
      docs: async () => {
        const opts: DocsOptsType = defaultDocsOpts

        const toolsOpts = await select<any, 'docusaurus' | 'nextra' | 'mintlify'>({
          message: 'Select tools/framework.',
          options: [
            { value: 'docusaurus', label: 'Docusaurus' },
            { value: 'mintlify', label: 'Mintlify' },
            { value: 'nextra', label: 'Nextra' },
          ],
          initialValue: 'nextra',
        })

        opts.tools = toolsOpts

        if (typeof toolsOpts === 'string') {
          opts[toolsOpts].path = await text({
            message: `Where should we create your documentation?`,
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
            message: `Do you want to create with default name?`,
            initialValue: false,
          })
          if (!shouldDefaultName) {
            opts[toolsOpts].name = await text({
              message: `What is your name?`,
              placeholder: '',
              validate: (value: string) => {
                if (!value)
                  return 'Please enter a name.'
                return void (0)
              },
            })
          }
          else {
            opts[toolsOpts].name = 'docs'
          }

          if (toolsOpts === 'nextra') {
            const themeOpts = await select<any, string>({
              message: 'Select a theme first',
              options: [
                { value: 'docs', label: 'Docs' },
                { value: 'blog', label: 'Blog' },
                { value: 'swr-site', label: 'SWR' },
              ],
              initialValue: 'docs',
            })

            opts[toolsOpts].theme = themeOpts
          }

          if (toolsOpts === 'docusaurus') {
            const langOpts = await confirm({
              message: 'Would you like to use TypeScript?',
              initialValue: false,
            })

            opts[toolsOpts].language = langOpts ? 'typescript' : ''
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
