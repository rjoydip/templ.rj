import { parse, resolve } from 'node:path'
import { readdir } from 'node:fs/promises'
import { readdirSync } from 'node:fs'
import { cwd } from 'node:process'
import { findUp, findUpSync } from 'find-up'
import { log, note } from '@clack/prompts'
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

interface ExeCmdType {
  execute: () => Promise<ProcessOutput | null>
  showOutput?: boolean
  showSpinner?: boolean
  title: string
}

export async function executeCommand(params: ExeCmdType = {
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
  if (showOutput)
    note((output ?? '').toString(), `${title}`)
}
