import { parse, resolve } from 'node:path'
import { readdir } from 'node:fs/promises'
import { readdirSync } from 'node:fs'
import { cwd } from 'node:process'
import { log, spinner } from '@clack/prompts'
import { execa } from 'execa'
import { findUp, findUpSync } from 'find-up'
import colors from 'picocolors'

interface SpinnerType {
  start: (msg?: string | undefined) => void
  stop: (msg?: string | undefined, code?: number | undefined) => void
  message: (msg?: string | undefined) => void
}

interface ExecCmdrParams {
  cmd: string
  msg: {
    start: string
    stop: string
  }
  cwd?: string
  spinner: SpinnerType
}

export async function execCmd(params: ExecCmdrParams) {
  const s = params.spinner ?? spinner()
  s.start(params.msg.start.concat(' ') ?? '')
  const { stdout, stderr } = await execa(params.cmd ?? 'pnpm -v', {
    cwd: params.cwd || cwd(),
  })
  s.stop(colors.green(params.msg.stop) ?? '')
  if (stdout || stderr)
    log.message(stdout ?? stderr)
}

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
