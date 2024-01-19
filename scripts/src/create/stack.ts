import { cwd, exit } from 'node:process'
import { basename, join, resolve, sep } from 'node:path'
import { existsSync } from 'node:fs'
import { cp, mkdir } from 'node:fs/promises'
import { platform } from 'node:os'
import { consola } from 'consola'
import { downloadTemplate, startShell } from 'giget'
import { installDependencies } from 'nypm'
import { colors } from 'consola/utils'
import latestVersion from 'latest-version'
import { type PM, exeCmd, getPkgManagers, hasDryRun, stackNotes, updateTemplateAssets } from '../utils'

interface OptsCommon {
  pkgManager: PM
  install: boolean
}
interface PkgOptsType extends OptsCommon {
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
interface DocOptsType extends OptsCommon {
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
interface AppOptsType extends OptsCommon {
  type: string
  astro: {
    name: string
    path: string
  }
  next: {
    name: string
    path: string
    src_dir: boolean
    app_route: boolean
    eslint: boolean
    import_alias: boolean
    import_alias_value: string
    language: string
    tailwind: boolean
    template: string
  }
  nitro: {
    name: string
    path: string
  }
  nuxt: {
    name: string
    path: string
    template: string
    force: boolean
    gitInit: boolean
    shell: boolean
  }
  vite: {
    name: string
    path: string
    language: string
    template: string
  }
  vue: {
    name: string
    path: string
    cwd: string | null
    language: string
    jsx: boolean
    vue_route: boolean
    pinia: boolean
    vitest: boolean
    e2e_testing: boolean
    eslint: boolean
    prettier: boolean
  }
}

const frontendOptions = [
  { value: 'astro', label: 'Astro' },
  { value: 'next', label: 'Next' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'nitro', label: 'Nitro' },
  { value: 'vite', label: 'Vite' },
  { value: 'vue', label: 'Vue' },
]
const nuxtOptions = [
  { value: 'ui', label: 'Nuxt UI' },
  { value: 'content', label: 'Nuxt Content' },
  { value: 'module', label: 'Nuxt Module with Module Builder' },
  { value: 'layer', label: 'Nuxt Layer Starter with Extends (experimental)' },
  { value: 'module-devtools', label: 'Nuxt Module with Nuxt DevTools' },
  { value: 'doc-driven', label: 'Nuxt Docs Driven' },
  { value: 'v2', label: 'Nuxt 2' },
  { value: 'v2-bridge', label: 'Nuxt 2 + Bridge' },
  { value: 'v3', label: 'Nuxt 3' },
]
const viteJSTemplates = [
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'preact', label: 'Preact' },
  { value: 'lit', label: 'Lit' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'qwik', label: 'Qwik' },
]
const viteTSTemplates = [
  { value: 'vanilla-ts', label: 'Vanilla' },
  { value: 'vue-ts', label: 'Vue' },
  { value: 'react-ts', label: 'React' },
  { value: 'preact-ts', label: 'Preact' },
  { value: 'lit-ts', label: 'Lit' },
  { value: 'svelte-ts', label: 'Svelte' },
  { value: 'solid-ts', label: 'Solid' },
  { value: 'qwik-ts', label: 'Qwik' },
]

async function main() {
  const root = join(cwd(), '..')

  const type = await consola.prompt('Select a stack which you want to create.', {
    type: 'select',
    options: [
      'Application',
      'Documentation',
      'Package',
    ],
    initial: 'Package',
  })

  if (type === 'Application') {
    const appOpts: AppOptsType = {
      type: '',
      astro: {
        name: '',
        path: '',
      },
      next: {
        name: '',
        path: '',
        src_dir: false,
        app_route: false,
        eslint: false,
        import_alias: false,
        import_alias_value: '',
        language: '',
        tailwind: false,
        template: '',
      },
      nitro: {
        name: '',
        path: '',
      },
      nuxt: {
        name: '',
        path: '',
        template: '',
        force: false,
        gitInit: false,
        shell: false,
      },
      vite: {
        name: '',
        path: '',
        language: '',
        template: '',
      },
      vue: {
        name: '',
        path: '',
        cwd: null,
        language: '',
        jsx: false,
        vue_route: false,
        pinia: false,
        vitest: false,
        e2e_testing: false,
        eslint: false,
        prettier: false,
      },
      pkgManager: 'npm',
      install: true,
    }

    appOpts.type = await consola.prompt('Select frontend framework.', {
      type: 'select',
      options: frontendOptions.map(i => i.label),
      initial: '',
    })

    if (appOpts.type === 'Next') {
      appOpts.next.path = await consola.prompt(`Where should we create your ${colors.cyan('application')}?`, {
        type: 'text',
        initial: appOpts.next.path,
        default: appOpts.next.path,
        placeholder: appOpts.next.path,
      })

      const shouldDefaultName = await consola.prompt('Do you want to create with default name?', {
        type: 'confirm',
        initial: true,
      })

      if (!shouldDefaultName) {
        appOpts.next.name = await consola.prompt('What would be your application name?', {
          type: 'text',
          default: '',
          initial: '',
          placeholder: '',
        })
      }
      else {
        appOpts.next.name = 'apps'
      }
      const lang = await consola.prompt('Would you like to use JavaeScript?', {
        type: 'confirm',
        initial: false,
      })
      appOpts.next.language = lang ? 'javascript' : 'typescript'

      appOpts.next.eslint = await consola.prompt('Would you like to use ESLint?', {
        type: 'confirm',
        initial: true,
      })

      appOpts.next.tailwind = await consola.prompt('Would you like to use Tailwind CSS?', {
        type: 'confirm',
        initial: true,
      })

      appOpts.next.src_dir = await consola.prompt(`Initialize inside a ${colors.cyan('src')} directory`, {
        type: 'confirm',
        initial: false,
      })

      appOpts.next.app_route = await consola.prompt(`Would you like to use App Router? (${colors.cyan('recommended')})`, {
        type: 'confirm',
        initial: true,
      })

      appOpts.next.import_alias = await consola.prompt('Would you like to customize the default import alias?', {
        type: 'confirm',
        initial: false,
      })

      if (appOpts.next.import_alias) {
        appOpts.next.import_alias_value = await consola.prompt('Specify import alias to use (default "@/*")', {
          type: 'text',
          default: '@/*',
          placeholder: '@/*',
          initial: '@/*',
        })
      }
    }

    if (appOpts.type === 'Nuxt') {
      appOpts.nuxt.path = await consola.prompt(`Where should we create your ${colors.cyan('application')}?`, {
        type: 'text',
        initial: appOpts.nuxt.path,
        default: appOpts.nuxt.path,
        placeholder: appOpts.nuxt.path,
      })

      const shouldDefaultName = await consola.prompt('Do you want to create with default name?', {
        type: 'confirm',
        initial: true,
      })

      if (!shouldDefaultName) {
        appOpts.nuxt.name = await consola.prompt('What would be your application name?', {
          type: 'text',
          default: '',
          initial: '',
          placeholder: '',
        })
      }
      else {
        appOpts.nuxt.name = 'apps'
      }

      appOpts.nuxt.template = await consola.prompt('Select Nuxt template', {
        type: 'select',
        options: nuxtOptions.map(i => i.label),
        initial: '',
      })

      appOpts.nuxt.force = await consola.prompt('Override existing directory?', {
        type: 'confirm',
        initial: false,
      })

      appOpts.nuxt.gitInit = await consola.prompt('Initialize git repository?', {
        type: 'confirm',
        initial: false,
      })

      appOpts.nuxt.shell = await consola.prompt('Start shell after installation in project directory?', {
        type: 'confirm',
        initial: false,
      })
    }

    if (appOpts.type === 'Vite') {
      appOpts.vite.path = await consola.prompt(`Where should we create your ${colors.cyan('application')}?`, {
        type: 'text',
        initial: appOpts.vite.path,
        default: appOpts.vite.path,
        placeholder: appOpts.vite.path,
      })

      const shouldDefaultName = await consola.prompt('Do you want to create with default name?', {
        type: 'confirm',
        initial: true,
      })

      if (!shouldDefaultName) {
        appOpts.vite.name = await consola.prompt('What would be your application name?', {
          type: 'text',
          default: '',
          initial: '',
          placeholder: '',
        })
      }
      else {
        appOpts.vite.name = 'apps'
      }

      const lang = await consola.prompt('Would you like to use TypeScript?', {
        type: 'confirm',
        initial: false,
      })

      appOpts.vite.language = lang ? 'typescript' : 'javascript'

      if (lang) {
        appOpts.vite.template = await consola.prompt('Select vite template (TypeScript).', {
          type: 'select',
          options: viteTSTemplates.map(i => i.label),
          initial: '',
        })
      }

      if (lang === false) {
        appOpts.vite.template = await consola.prompt('Select vite template (JavaScript).', {
          type: 'select',
          options: viteJSTemplates.map(i => i.label),
          initial: '',
        })
      }
    }

    if (appOpts.type === 'Vue') {
      appOpts.vue.path = await consola.prompt(`Where should we create your ${colors.cyan('application')}?`, {
        type: 'text',
        initial: appOpts.vue.path,
        default: appOpts.vue.path,
        placeholder: appOpts.vue.path,
      })

      const shouldDefaultName = await consola.prompt('Do you want to create with default name?', {
        type: 'confirm',
        initial: true,
      })

      if (!shouldDefaultName) {
        appOpts.vue.name = await consola.prompt('What would be your application name?', {
          type: 'text',
          default: '',
          initial: '',
          placeholder: '',
        })
      }
      else {
        appOpts.vue.name = 'apps'
      }
      const lang = await consola.prompt('Add TypeScript?', {
        type: 'confirm',
        initial: false,
      })
      appOpts.vue.language = lang ? 'typescript' : 'javascript'

      appOpts.vue.jsx = await consola.prompt('Add JSX Support?', {
        type: 'confirm',
        initial: false,
      })

      appOpts.vue.vue_route = await consola.prompt('Add Vue Router for Single Page Application development?', {
        type: 'confirm',
        initial: false,
      })

      appOpts.vue.pinia = await consola.prompt('Add Pinia for state management?', {
        type: 'confirm',
        initial: false,
      })

      appOpts.vue.vitest = await consola.prompt('Add Vitest for Unit testing?', {
        type: 'confirm',
        initial: false,
      })

      appOpts.vue.e2e_testing = await consola.prompt('Add an End-to-End Testing Solution?', {
        type: 'confirm',
        initial: false,
      })

      appOpts.vue.eslint = await consola.prompt('Add ESLint for code quality?', {
        type: 'confirm',
        initial: false,
      })

      appOpts.vue.prettier = await consola.prompt('Add Prettier for code formatting?', {
        type: 'confirm',
        initial: false,
      })
    }

    if (hasDryRun()) {
      consola.box(appOpts)
      return
    }

    const { type, next, nuxt, install, pkgManager } = appOpts

    if (type === 'Astro') {
      consola.warn('Coming soon')
      return
    }

    if (type === 'Next') {
      const { language, tailwind, eslint, app_route, src_dir, import_alias, import_alias_value, path, name } = next

      const appPath = join(path, name)
      const dest = platform() === 'win32' ? resolve(root, appPath).replace(sep, '\\\\') : resolve(root, appPath)

      consola.start(`Creating ${type} application`)

      if (!existsSync(dest))
        await mkdir(dest, { recursive: true })

      await exeCmd({
        title: 'Next Application',
        cmd: `npx create-next-app ${dest} ${language === 'javascript' ? '--js' : '--ts'} ${tailwind ? '--tailwind' : ''} ${eslint ? '--eslint' : ''} ${app_route ? '--app' : ''} --src-dir ${src_dir} ${import_alias ? `--import-alias ${import_alias_value}` : '--import-alias'} ${install ? `--use-${pkgManager}` : `--no-use-${pkgManager}`}`,
        showOutput: true,
        showSpinner: true,
      })

      consola.success(`Generated ${type} application`)
      stackNotes(appPath, install, pkgManager)
    }

    if (type === 'Nuxt') {
      const { template, force, gitInit, shell, name, path } = nuxt

      const appPath = join(path, name)
      const dest = platform() === 'win32' ? resolve(root, appPath).replace(sep, '\\\\') : resolve(root, appPath)

      consola.start(`Creating ${type} application`)

      if (!existsSync(dest))
        await mkdir(dest, { recursive: true })

      const nuxtTemplIndex = nuxtOptions.findIndex(i => i.label.toLowerCase() === template.toLowerCase()) || 0

      if (nuxtTemplIndex) {
        await downloadTemplate(nuxtOptions[nuxtTemplIndex]?.value ?? 'v3', {
          dir: dest,
          force: !!force,
          install,
          registry: 'https://raw.githubusercontent.com/nuxt/starter/templates/templates',
        })

        await updateTemplateAssets({
          name: `@templ/${name}`,
          root,
          dest,
          pkgManager,
        })

        if (gitInit) {
          await exeCmd({
            title: 'Git Init',
            cmd: `git init ${dest}`,
            showOutput: true,
            showSpinner: true,
          })
        }

        if (shell)
          startShell(dest)

        consola.success(`Generated ${type} application`)
        stackNotes(appPath, install, pkgManager, false)
      }
      else {
        consola.error('Invalid template options')
      }
    }

    if (type === 'Nitro') {
      consola.warn('Coming soon')
      return
    }

    if (type === 'Vite') {
      consola.warn('Coming soon')
      return
    }

    if (type === 'Vue') {
      consola.warn('Coming soon')
      return
    }
  }

  if (type === 'Documentation') {
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

        const appPath = join(path, name)
        const dest = platform() === 'win32' ? resolve(root, appPath).replace(sep, '\\\\') : resolve(root, appPath)

        await downloadTemplate(`github:facebook/docusaurus/create-docusaurus/templates/${(language === 'ts' ? 'classic-typescript' : 'classic')}`, {
          dir: dest,
          force: true,
          forceClean: true,
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

        const appPath = join(path, name)
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
        const appPath = join(path, name)
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
  }

  if (type === 'Package') {
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

  exit(0)
}

main().catch(consola.error)
