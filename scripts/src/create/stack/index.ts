import { join } from 'node:path'
import { cwd } from 'node:process'
import { type AppsOptsType, create as createApp, defaultAppsOpts } from './apps'
import { type DocsOptsType, create as createDoc, defaultDocsOpts } from './docs'
import { type PkgsOptsType, create as createPackage, defaultPkgsOpts } from './pkgs'

enum CreateType {
  APPS = 'apps',
  DOCS = 'docs',
  PKGS = 'pkgs',
  CUSTOM = 'custom',
}

export interface CreateOptionsType {
  type: symbol | string
  apps: AppsOptsType
  docs: DocsOptsType
  pkgs: PkgsOptsType
}

export interface OptionsType {
  create: CreateOptionsType
  packageManager: string
  install: boolean
}

export interface SpinnerType {
  start: (msg?: string | undefined) => void
  stop: (msg?: string | undefined, code?: number | undefined) => void
  message: (msg?: string | undefined) => void
}

export function getCreateOpts() {
  return {
    docs: defaultDocsOpts,
    pkgs: defaultPkgsOpts,
    apps: defaultAppsOpts,
    type: '',
  }
}

export function getDefaultOpts() {
  return {
    create: getCreateOpts(),
    packageManager: 'pnpm',
    install: false,
  }
}

export async function createStack(options: OptionsType) {
  const root = join(cwd(), '..')
  const { install, packageManager } = options
  const { apps, docs, pkgs, type } = options?.create

  if (type === CreateType.APPS)
    await createApp(root, packageManager, install, apps)

  if (type === CreateType.PKGS)
    await createPackage(root, packageManager, install, pkgs)

  if (type === CreateType.DOCS)
    await createDoc(root, packageManager, install, docs)

  return void 0
}

export * as apps from './apps'
export * as docs from './docs'
export * as pkgs from './pkgs'
