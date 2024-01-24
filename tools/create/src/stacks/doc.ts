import { cwd, exit, stdin } from 'node:process'
import { platform, type } from 'node:os'
import { resolve, sep } from 'node:path'
import latestVersion from 'latest-version'
import consola from 'consola'
import { colors } from 'consola/utils'
import type { PM } from '../utils'
import { downloadTemplate, getPkgManagers, hasDryRun, stackNotes, updateTemplateAssets } from '../utils'

interface DocOptsType {
  pm: PM
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

export async function run() {
  const root = resolve(cwd(), '..')
  const docOpts: DocOptsType = {
    tools: 'Nextra',
    pm: 'npm',
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

  docOpts.pm = await consola.prompt('Select package manager.', {
    type: 'select',
    options: (await getPkgManagers()).map((pm: string) => pm.toUpperCase()),
    initial: docOpts.pm,
  }) as PM

  docOpts.install = await consola.prompt('Do you want to install dependencies?', {
    type: 'confirm',
    initial: true,
  })

  if (hasDryRun()) {
    consola.box(docOpts)
  }
  else {
    const { tools, Docusaurus, Mintlify, Nextra, pm, install } = docOpts

    if (tools === 'Docusaurus') {
      const { name, language, path } = Docusaurus
      consola.start(`\nCreating ${colors.cyan(type.toString())} documentation\n`)

      const dir = platform() === 'win32' ? resolve(root, path, name).replace(sep, '\\\\') : resolve(root, path, name)

      await downloadTemplate({
        repo: `github:facebook/docusaurus/create-docusaurus/templates/${(language === 'ts' ? 'classic-typescript' : 'classic')}`,
        dtOps: {
          dir,
          install,
        },
      })

      await updateTemplateAssets({
        name: `@templ/${name}`,
        pm,
        root,
        dir,
      })

      consola.success(`Generated ${colors.cyan(type.toString())} documentation`)

      stackNotes(dir, install, pm)
    }

    if (tools === 'Mintlify') {
      const { name, path } = Mintlify
      consola.start(`\nCreating ${colors.cyan(type.toString())} documentation\n`)

      const dir = platform() === 'win32' ? resolve(root, path, name).replace(sep, '\\\\') : resolve(root, path, name)

      await downloadTemplate({
        repo: 'github:mintlify/starter',
        dtOps: {
          dir,
          install,
        },
      })

      const mintilifyLV = await latestVersion('mintlify')

      await updateTemplateAssets({
        name: `@templ/${name}`,
        pm,
        root,
        dir,
        dotProps: {
          scripts: {
            dev: 'mintlify dev',
          },
          devDependencies: {
            mintilify: `^${mintilifyLV}`,
          },
        },
      })

      consola.success(`Generated ${colors.cyan(type.toString())} documentation`)

      stackNotes(dir, install, pm)
    }

    if (tools === 'Nextra') {
      const { name, theme, path } = Nextra
      consola.start(`\nCreating ${colors.cyan(type.toString())} documentation\n`)

      const themeName = theme === 'SWR' ? 'swr-site' : theme.toLowerCase()
      const dir = resolve(root, path, name)

      await downloadTemplate({
        repo: `github:shuding/nextra/examples/${themeName}`,
        dtOps: {
          dir,
          install,
        },
      })

      await updateTemplateAssets({
        name: `@templ/${name}`,
        pm,
        root,
        dir,
      })

      consola.success(`Generated ${colors.cyan(type.toString())} documentation`)

      stackNotes(dir, install, pm)
    }
  }

  stdin.on('data', key => (key.toString() === '\u0003') ? exit(0) : null)
}

run().catch(consola.error)
