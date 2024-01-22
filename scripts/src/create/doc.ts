import { cwd, exit, stdin } from 'node:process'
import { platform, type } from 'node:os'
import { resolve, sep } from 'node:path'
import latestVersion from 'latest-version'
import { downloadTemplate } from 'giget'
import consola from 'consola'
import { type PM, getPkgManagers, hasDryRun, stackNotes, updateTemplateAssets } from '../utils'

interface DocOptsType {
  pkgManager: PM
  install: boolean
  Docusaurus: {
    name: string
    path: string
    language: string
    theme: string
  }
  tools: string
  Mintlify: {
    name: string
    path: string
  }
  Nextra: {
    name: string
    path: string
    theme: string
  }
}

async function main() {
  const root = resolve(cwd(), '..')
  const docOpts: DocOptsType = {
    tools: 'Nextra',
    pkgManager: 'npm',
    install: true,
    Docusaurus: {
      name: 'docs',
      path: './docs',
      language: 'js',
      theme: '',
    },
    Mintlify: {
      name: 'docs',
      path: './docs',
    },
    Nextra: {
      name: 'docs',
      path: './docs',
      theme: 'Docs',
    },
  }

  docOpts.tools = await consola.prompt('Select documentation.', {
    type: 'select',
    options: [
      'Docusaurus',
      'Mintlify',
      'Nextra',
      'Voca',
    ],
    initial: 'Nextra',
  })

  const tools = docOpts.tools === 'Docusaurus' ? 'Docusaurus' : docOpts.tools === 'Mintlify' ? 'Mintlify' : 'Nextra'

  docOpts[tools].path = await consola.prompt('Where should we create your documentation?', {
    type: 'text',
    default: '',
    placeholder: '',
    initial: '',
  })

  const shouldDefaultName = await consola.prompt('Do you want to create with default name?', {
    type: 'confirm',
    initial: true,
  })

  if (!shouldDefaultName) {
    docOpts[tools].name = await consola.prompt('What would be your documentation name?', {
      type: 'text',
      default: '',
      initial: '',
      placeholder: '',
    })
  }
  else {
    docOpts[tools].name = 'docs'
  }

  if (tools === 'Nextra') {
    docOpts[tools].theme = await consola.prompt('Select a Nextra theme', {
      type: 'select',
      options: [
        'Docs',
        'Blog',
        'SWR',
      ],
      initial: 'Docs',
    })
  }

  if (tools === 'Docusaurus') {
    const lang = await consola.prompt('Would you like to use TypeScript?', {
      type: 'confirm',
      initial: false,
    })
    docOpts[tools].language = lang ? 'typescript' : ''
  }

  docOpts.pkgManager = await consola.prompt('Select package manager.', {
    type: 'select',
    options: (await getPkgManagers()).map((pm: string) => pm.toUpperCase()),
    initial: docOpts.pkgManager,
  }) as PM

  docOpts.install = await consola.prompt('Do you want to install dependencies?', {
    type: 'confirm',
    initial: true,
  })

  if (hasDryRun()) {
    consola.box(docOpts)
  }
  else {
    const { tools, Docusaurus, Mintlify, Nextra, pkgManager, install } = docOpts

    if (tools === 'Docusaurus') {
      const { name, language, path } = Docusaurus
      consola.start(`Creating ${type} documentation`)

      const appPath = resolve(path, name)
      const dest = platform() === 'win32' ? resolve(root, appPath).replace(sep, '\\\\') : resolve(root, appPath)

      await downloadTemplate(`github:facebook/docusaurus/create-docusaurus/templates/${(language === 'ts' ? 'classic-typescript' : 'classic')}`, {
        dir: dest,
        install,
      })

      await updateTemplateAssets({
        name: `@templ/${name}`,
        pkgManager,
        root,
        dest,
      })

      consola.success(`Generated ${type} documentation`)

      stackNotes(appPath, install, pkgManager)
    }

    if (tools === 'Mintlify') {
      const { name, path } = Mintlify
      consola.start(`Creating ${type} documentation`)

      const appPath = resolve(path, name)
      const dest = platform() === 'win32' ? resolve(root, appPath).replace(sep, '\\\\') : resolve(root, appPath)

      await downloadTemplate('github:mintlify/starter', {
        dir: dest,
        install,
      })

      const mintilifyLV = await latestVersion('mintlify')

      await updateTemplateAssets({
        name: `@templ/${name}`,
        pkgManager,
        root,
        dest,
        dotProps: {
          scripts: {
            dev: 'mintlify dev',
          },
          devDependencies: {
            mintilify: `^${mintilifyLV}`,
          },
        },
      })

      consola.success(`Generated ${type} documentation`)

      stackNotes(appPath, install, pkgManager)
    }

    if (tools === 'Nextra') {
      const { name, theme, path } = Nextra
      consola.start(`Creating ${type} documentation`)

      const themeName = theme === 'SWR' ? 'swr-site' : theme.toLowerCase()
      const appPath = resolve(path, name)
      const dest = resolve(root, appPath)

      await downloadTemplate(`github:shuding/nextra/examples/${themeName}`, {
        dir: dest,
        install,
      })

      await updateTemplateAssets({
        name: `@templ/${name}`,
        pkgManager,
        root,
        dest,
      })

      consola.success(`Generated ${type} documentation`)

      stackNotes(appPath, install, pkgManager)
    }
  }

  stdin.on('data', key => (key.toString() === '\u0003') ? exit(0) : null)
}

main().catch(consola.error)
