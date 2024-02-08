import { cwd, exit, stdin } from 'node:process'
import { platform, type } from 'node:os'
import { resolve, sep } from 'node:path'
import latestVersion from 'latest-version'
import consola from 'consola'
import { colors } from 'consola/utils'
import { downloadTemplate, hasDryRun, stackNotes, updateTemplateAssets } from '../utils'

interface DocOptsType {
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

  docOpts[tools].path = await consola.prompt('Where should we generate your documentation?', {
    type: 'text',
    default: '',
    placeholder: '',
    initial: '',
  })

  const shouldDefaultName = await consola.prompt('Do you want to generate with default name?', {
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

  if (hasDryRun()) {
    consola.box(docOpts)
  }
  else {
    const { tools, Docusaurus, Mintlify, Nextra } = docOpts

    if (tools === 'Docusaurus') {
      const { name, language, path } = Docusaurus
      consola.start(`\nCreating ${colors.cyan(type.toString())} documentation\n`)

      const dir = platform() === 'win32' ? resolve(root, path, name).replace(sep, '\\\\') : resolve(root, path, name)

      await downloadTemplate({
        repo: `github:facebook/docusaurus/generate-docusaurus/templates/${(language === 'ts' ? 'classic-typescript' : 'classic')}`,
        dtOps: {
          dir,
          install: false,
        },
      })

      await updateTemplateAssets({
        name: `@templ/${name}`,
        root,
        dir,
      })

      consola.success(`Generated ${colors.cyan(type.toString())} documentation`)

      stackNotes({ path: dir })
    }

    if (tools === 'Mintlify') {
      const { name, path } = Mintlify
      consola.start(`\nCreating ${colors.cyan(type.toString())} documentation\n`)

      const dir = platform() === 'win32' ? resolve(root, path, name).replace(sep, '\\\\') : resolve(root, path, name)

      await downloadTemplate({
        repo: 'github:mintlify/starter',
        dtOps: {
          dir,
          install: false,
        },
      })

      const mintilifyLV = await latestVersion('mintlify')

      await updateTemplateAssets({
        name: `@templ/${name}`,
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

      stackNotes({ path: dir })
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
          install: false,
        },
      })

      await updateTemplateAssets({
        name: `@templ/${name}`,
        root,
        dir,
      })

      consola.success(`Generated ${colors.cyan(type.toString())} documentation`)

      stackNotes({ path: dir })
    }
  }

  stdin.on('data', key => (key.toString() === '\u0003') ? exit(0) : null)
}

run().catch(consola.error)
