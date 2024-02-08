import { cwd } from 'node:process'
import { join, resolve } from 'node:path'
import { cp, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { colors } from 'consola/utils'
import consola from 'consola'
import { downloadTemplate, hasDryRun, stackNotes, updateTemplateAssets } from '../utils'

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
  }

  serverOpts.path = await consola.prompt(`Where should we generate your ${colors.cyan('server')}?`, {
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
    consola.start(`\nPulling Hono Templates\n`)

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

  if (hasDryRun()) {
    consola.box(serverOpts)
    return
  }

  const { name, type, path, hono, fastify } = serverOpts

  if (type.toString() === 'Hono') {
    const dir = resolve(root, path, name)

    consola.start(`\nCreating ${colors.cyan(type.toString())} server\n`)

    await cp(join(honoTmplDir, hono.name), dir, { force: true, recursive: true })

    await updateTemplateAssets({
      name: `@templ/${name}`,
      root,
      dir,
      replacement: {},
    })

    consola.success(`Generated ${colors.cyan(type.toString())} server`)
    stackNotes({ path: dir })
  }

  if (type.toString() === 'Fastify') {
    const dir = resolve(root, path, name)
    consola.start(`\nCreating ${colors.cyan(type.toString())} server\n`)

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
      root,
      dir,
      replacement: {},
    })

    consola.success(`Generated ${colors.cyan(type.toString())} server`)
    stackNotes({ path: dir })
  }
}

run().catch(consola.error)
