import { cwd } from 'node:process'
import { join, resolve } from 'node:path'
import { cp, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { colors } from 'consola/utils'
import consola from 'consola'
import { installDependencies } from 'nypm'
import type { PM } from '../utils'
import { downloadTemplate, getPkgManagers, hasDryRun, stackNotes, updateTemplateAssets } from '../utils'

type Servers = 'Hono' | 'Fastify' | 'Express' | 'Koa' | 'Hapi'

interface ServerOptsType {
  path: string
  name: string
  type: Servers
  hono: {
    name: string
  }
  fastify: {
    repo: string
  }
  express: Record<string, string>
  koa: Record<string, string>
  hapi: Record<string, string>
  pkgManager: string
  install: boolean
}

export async function run() {
  const root = resolve(cwd(), '..')
  const honoTmplDir = resolve(tmpdir(), 'hono-templates')
  const serverOpts: ServerOptsType = {
    path: '',
    type: 'Hono',
    name: '',
    hono: {
      name: '',
    },
    fastify: {
      repo: '',
    },
    express: {},
    koa: {},
    hapi: {},
    pkgManager: 'npm',
    install: true,
  }

  serverOpts.path = await consola.prompt(`Where should we create your ${colors.cyan('server')}?`, {
    type: 'text',
    initial: serverOpts.path,
    default: serverOpts.path,
    placeholder: serverOpts.path,
  })

  serverOpts.name = await consola.prompt(`What would be ${colors.cyan('server')} name?`, {
    type: 'text',
    default: serverOpts.name,
    initial: serverOpts.name,
    placeholder: serverOpts.name,
  })

  serverOpts.type = await consola.prompt(`Select a ${colors.cyan('server')} type.`, {
    type: 'select',
    options: [
      'Hono',
      'Fastify',
      'Express',
      'Koa',
      'Hapi',
    ],
    initial: serverOpts.type,
  }) as Servers

  if (serverOpts.type.toString() === 'Hono') {
    await downloadTemplate({
      repo: 'github:honojs/starter/templates',
      dtOps: {
        dir: honoTmplDir,
        force: true,
        install: false,
        preferOffline: true,
      },
    })

    serverOpts.hono.name = await consola.prompt(`Select a ${colors.cyan('server')} type.`, {
      type: 'select',
      options: (await readdir(honoTmplDir)).map(i => i),
    })
  }

  if (serverOpts.type.toString() === 'Fastify') {
    const pullCustom = await consola.prompt('Do you want to pull from custom repo?', {
      type: 'confirm',
      initial: true,
    })

    if (pullCustom) {
      serverOpts.fastify.repo = await consola.prompt(`What would be ${colors.cyan('server')} name?`, {
        type: 'text',
        default: serverOpts.fastify.repo,
        initial: serverOpts.fastify.repo,
        placeholder: '[provider]:repo[/subpath][#ref]',
      })
    }
  }

  const p = await consola.prompt('Select package manager.', {
    type: 'select',
    options: (await getPkgManagers()).map((pm: string) => pm.toUpperCase()),
    initial: serverOpts.pkgManager,
  }) as PM

  serverOpts.pkgManager = p.toLowerCase()

  serverOpts.install = await consola.prompt('Do you want to install dependencies?', {
    type: 'confirm',
    initial: true,
  })

  if (hasDryRun()) {
    consola.box(serverOpts)
    return
  }

  const { name, type, path, pkgManager, install, hono, fastify } = serverOpts
  const pm = pkgManager

  if (type.toString() === 'Hono') {
    const dir = resolve(root, path, name)

    consola.start(`Creating ${type} server`)

    await cp(join(honoTmplDir, hono.name), dir, { force: true, recursive: true })

    await updateTemplateAssets({
      name: `@templ/${name}`,
      pm,
      root,
      dir,
      replacement: {},
    })

    if (install) {
      consola.start(`Installaing via ${pm}`)
      await installDependencies({
        cwd: dir,
        packageManager: {
          name: pkgManager as PM,
          command: pm === 'npm' ? 'npm install' : `${pm}`,
        },
        silent: true,
      })
    }

    consola.success(`Generated ${type} server`)
    stackNotes(dir, install, pkgManager)
  }

  if (type.toString() === 'Fastify') {
    const dir = resolve(root, path, name)
    consola.start(`Creating ${type} server`)

    await downloadTemplate({
      repo: fastify.repo !== '' ? fastify.repo : 'github:fastify/fastify-starter-codesandbox#master',
      dtOps: {
        dir,
        force: true,
        install: false,
        preferOffline: true,
      },
    })

    await updateTemplateAssets({
      name: `@templ/${name}`,
      pm,
      root,
      dir,
      replacement: {},
    })

    if (install) {
      await installDependencies({
        cwd: dir,
        packageManager: {
          name: pkgManager as PM,
          command: pkgManager === 'npm' ? 'npm install' : `${pkgManager}`,
        },
        silent: true,
      })
    }

    consola.success(`Generated ${type} server`)
    stackNotes(dir, install, pkgManager)
  }
}

run().catch(consola.error)
