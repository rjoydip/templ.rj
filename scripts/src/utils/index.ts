import { parse, resolve } from 'node:path'
import { readdir } from 'node:fs/promises'
import { readdirSync } from 'node:fs'
import { cwd } from 'node:process'
import { log, note } from '@clack/prompts'
import { findUp, findUpSync } from 'find-up'
import type { ProcessOutput } from 'zx/core'
import { spinner } from 'zx'
import { within } from 'zx/core'

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
