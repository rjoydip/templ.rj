import { parse, resolve } from 'node:path'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { readdirSync } from 'node:fs'
import { cwd } from 'node:process'
import { log, note } from '@clack/prompts'
import { findUp, findUpSync } from 'find-up'
import { createRegExp, exactly } from 'magic-regexp'
import type { ProcessOutput } from 'zx/core'
import { spinner } from 'zx'
import { within } from 'zx/core'
import latestVersion from 'latest-version'

export function getRootSync() {
  const root = findUpSync('pnpm-workspace.yaml') || findUpSync('.npmrc') || cwd()
  return parse(root).dir
}
export function getPackageRootSync() {
  return resolve(getRootSync() || cwd(), 'packages')
}
export function getPackagesSync() {
  const pkgRoot = getPackageRootSync()
  return readdirSync(pkgRoot)
}

// Async call
export async function getRootAsync() {
  const root = await findUp('pnpm-workspace.yaml') || await findUp('.npmrc') || cwd()
  return parse(root).dir
}
export async function getPackageRootAsync() {
  const root = await getRootAsync()
  return resolve(root, 'packages')
}
export async function getPackagesAsync() {
  const pkgRoot = await getPackageRootAsync()
  return await readdir(pkgRoot)
}

interface ExeCommon {
  showOutput?: boolean
  showSpinner?: boolean
  title: string
}

interface ExeCmdType<T> extends ExeCommon {
  execute: () => Promise<T | ProcessOutput | null>
}

interface ExeFnType<T> extends ExeCommon {
  fn: () => Promise<T | null>
}

export async function executeCommand<T>(params: ExeCmdType<T> = {
  execute: async () => null,
  showOutput: true,
  showSpinner: true,
  title: '',
}) {
  const { execute, showOutput, showSpinner, title } = params
  log.message('')
  const output = await within(async () => {
    return showSpinner ? await spinner(title, async () => await execute()) : await execute()
  })
  if (output !== null) {
    if (showOutput)
      note((output ?? '').toString(), `${title}`)
  }
}

export async function executeFn<T>(params: ExeFnType<T> = {
  fn: async () => null,
  showOutput: true,
  showSpinner: true,
  title: '',
}) {
  const { fn, showOutput, showSpinner, title } = params
  log.message('')
  const output = await within(async () => {
    return showSpinner ? await spinner(title, async () => await fn()) : await fn()
  })

  if (output !== null) {
    if (showOutput)
      note((output ?? '').toString(), `${title}`)
  }
}

export function stackNotes(path: string, isInstalled: boolean = false, packageManager: string = 'pnpm', showNote: boolean = true) {
  if (showNote)
    note(`cd ${path}\n${isInstalled ? `${packageManager} dev` : `${packageManager} install\n${packageManager} dev`}`, 'Next steps.')
}

export async function updateTemplateAssets(name: string = '', packageManager: string = 'pnpm', dest: string = cwd(), replacement: {
  from: string
  to: string
} = {
  from: '',
  to: '',
}) {
  const shouldReplaced = !!replacement.from && !!replacement.to
  const pkgPath = resolve(dest, 'package.json')
  const pkgVersion = await latestVersion(packageManager)

  let pkgDataRaw = await readFile(pkgPath, { encoding: 'utf8' })

  if (shouldReplaced) {
    const regExp = createRegExp(exactly(replacement.from), ['g', 'm'])
    const readmePath = resolve(dest, 'README.md')
    const readmeData = await readFile(readmePath, { encoding: 'utf8' })

    await writeFile(readmePath, readmeData.replace(regExp, replacement.to))

    pkgDataRaw = pkgDataRaw.replace(regExp, replacement.to)
  }

  const pkgData = JSON.parse(pkgDataRaw)

  pkgData.name = name
  pkgData.packageManager = packageManager.concat(`@${pkgVersion}`)

  if (pkgData.description)
    pkgData.description = ''

  if (pkgData.repository)
    pkgData.repository = ''

  return await writeFile(pkgPath, JSON.stringify(pkgData, null, 2))
}
