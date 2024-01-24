import { cwd } from 'node:process'
import { platform, tmpdir } from 'node:os'
import { existsSync } from 'node:fs'
import { cp, mkdir, readdir } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { startShell } from 'giget'
import { colors } from 'consola/utils'
import consola from 'consola'
import { installDependencies } from 'nypm'
import type { PM } from '../utils'
import { capitalize, downloadTemplate, execute, getPkgManagers, hasDryRun, stackNotes, updateTemplateAssets } from '../utils'

interface AppOptsType {
  type: string
  pm: PM
  install: boolean
  astro: {
    name: string
    path: string
    template_name: string
    template_path: string
  }
  next: {
    name: string
    path: string
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

export async function run() {
  const root = resolve(cwd(), '..')
  const astroTmplDir = resolve(tmpdir(), 'astro-templates')
  const nextTmplDir = resolve(tmpdir(), 'next-templates')
  const appOpts: AppOptsType = {
    type: '',
    astro: {
      name: '',
      path: '',
      template_name: '',
      template_path: astroTmplDir,
    },
    next: {
      name: '',
      path: '',
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
    pm: 'npm',
    install: true,
  }

  appOpts.type = await consola.prompt('Select frontend framework.', {
    type: 'select',
    options: frontendOptions.map(i => i.label),
    initial: '',
  })

  if (appOpts.type === 'Astro') {
    appOpts.astro.path = await consola.prompt(`Where should we create ${colors.cyan('astro')} application?`, {
      type: 'text',
      initial: appOpts.astro.path,
      default: appOpts.astro.path,
      placeholder: appOpts.astro.path,
    })

    appOpts.astro.name = await consola.prompt(`What would be ${colors.cyan('astro')} application name?`, {
      type: 'text',
      default: '',
      initial: '',
      placeholder: '',
    })

    if (appOpts.astro.path && appOpts.astro.name) {
      consola.start('\nPulling Astro Templates\n')

      await downloadTemplate({
        repo: `github:withastro/astro/examples`,
        dtOps: {
          dir: astroTmplDir,
          force: false,
          install: false,
          preferOffline: true,
        },
      })
    }

    appOpts.astro.template_name = await consola.prompt('Select Astro template', {
      type: 'select',
      options: (await readdir(astroTmplDir)).map(i => capitalize(i)),
    })
  }

  if (appOpts.type === 'Next') {
    appOpts.next.path = await consola.prompt(`Where should we create ${colors.cyan('application')}?`, {
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
      appOpts.next.name = await consola.prompt('What would be application name?', {
        type: 'text',
        default: '',
        initial: '',
        placeholder: '',
      })
    }
    else {
      appOpts.next.name = 'apps'
    }

    consola.start('\nPulling Next Templates\n')

    await downloadTemplate({
      repo: 'github:vercel/next.js/examples',
      dtOps: {
        dir: nextTmplDir,
        force: true,
        install: false,
        preferOffline: true,
      },
    })

    appOpts.next.template = await consola.prompt(`Select a ${colors.cyan('next')} template.`, {
      type: 'select',
      options: ((await readdir(nextTmplDir)) || []).map(i => i),
    })
  }

  if (appOpts.type === 'Nuxt') {
    appOpts.nuxt.path = await consola.prompt(`Where should we create ${colors.cyan('application')}?`, {
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
      appOpts.nuxt.name = await consola.prompt('What would be application name?', {
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
    appOpts.vite.path = await consola.prompt(`Where should we create ${colors.cyan('application')}?`, {
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
      appOpts.vite.name = await consola.prompt('What would be application name?', {
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
    appOpts.vue.path = await consola.prompt(`Where should we create ${colors.cyan('application')}?`, {
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
      appOpts.vue.name = await consola.prompt('What would be application name?', {
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

  appOpts.pm = await consola.prompt('Select package manager.', {
    type: 'select',
    options: (await getPkgManagers()).map((pm: string) => pm.toUpperCase()),
    initial: appOpts.pm,
  }) as PM

  appOpts.install = await consola.prompt('Do you want to install dependencies?', {
    type: 'confirm',
    initial: true,
  })

  if (hasDryRun()) {
    consola.box(appOpts)
    return
  }

  const { astro, next, nuxt, install, pm, type } = appOpts

  if (type === 'Astro') {
    const { name, path, template_name, template_path } = astro
    const dir = platform() === 'win32' ? resolve(root, path, name).replace(sep, '\\\\') : resolve(root, path, name)

    consola.start(`\nCreating ${colors.cyan(type.toLowerCase())} application\n`)

    if (!existsSync(dir))
      await mkdir(dir, { recursive: true })

    await cp(resolve(template_path, template_name.toLowerCase()), resolve(root, path, name), { force: true, recursive: true })

    await updateTemplateAssets({
      name: `@templ/${name}`,
      root,
      dir,
      pm,
    })

    if (install) {
      await installDependencies({
        cwd: dir,
        packageManager: {
          name: pm as PM,
          command: pm === 'npm' ? 'npm install' : `${pm}`,
        },
        silent: true,
      })
    }

    consola.success(`Generated ${colors.cyan(type.toLowerCase())} application`)
    stackNotes(dir, install, pm, false)
  }

  if (type === 'Next') {
    const { path, name, template } = next
    const dir = platform() === 'win32' ? resolve(root, path, name).replace(sep, '\\\\') : resolve(root, path, name)

    consola.start(`\nCreating ${colors.cyan(type.toLowerCase())} application\n`)

    if (!existsSync(dir))
      await mkdir(dir, { recursive: true })

    await cp(resolve(nextTmplDir, template), resolve(root, path, name), { force: true, recursive: true })

    await updateTemplateAssets({
      name: `@templ/${name}`,
      root,
      dir,
      pm,
    })

    if (install) {
      await installDependencies({
        cwd: dir,
        packageManager: {
          name: pm as PM,
          command: pm === 'npm' ? 'npm install' : `${pm}`,
        },
        silent: true,
      })
    }
    consola.success(`Generated ${colors.cyan(type.toLowerCase())} application`)
    stackNotes(dir, install, pm)
  }

  if (type === 'Nuxt') {
    const { template, gitInit, shell, name, path } = nuxt
    const dir = platform() === 'win32' ? resolve(root, path, name).replace(sep, '\\\\') : resolve(root, path, name)

    consola.start(`\nCreating ${colors.cyan(type.toLowerCase())} application\n`)

    const nuxtTemplIndex = nuxtOptions.findIndex(i => i.label.toLowerCase() === template.toLowerCase()) || 0

    if (nuxtTemplIndex) {
      await downloadTemplate({
        repo: nuxtOptions[nuxtTemplIndex]?.value ?? 'v3',
        dtOps: {
          dir,
          install,
          registry: 'https://raw.githubusercontent.com/nuxt/starter/templates/templates',
        },
      })

      await updateTemplateAssets({
        name: `@templ/${name}`,
        root,
        dir,
        pm,
      })

      if (gitInit) {
        await execute({
          title: 'Git Init',
          f: `git init ${dir}`,
          showOutput: true,
          showSpinner: true,
        })
      }

      if (shell)
        startShell(dir)

      consola.success(`Generated ${colors.cyan(type.toLowerCase())} application`)
      stackNotes(dir, install, pm, false)
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

  if (type === 'Vue')
    consola.warn('Coming soon')
}

run().catch(consola.error)
