import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
import { readdir } from 'node:fs/promises'
import { readdirSync } from 'node:fs'
import { log, spinner } from '@clack/prompts'
import { execa } from 'execa'
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
  spinner: SpinnerType
}

export async function execCmd(params: ExecCmdrParams) {
  const s = params.spinner ?? spinner()
  s.start(params.msg.start.concat(' ') ?? '')
  const { stdout, stderr } = await execa(params.cmd ?? 'pnpm -v')
  s.stop(colors.green(params.msg.stop) ?? '')
  if (stdout || stderr)
    log.message(stdout ?? stderr)
}

export function getRootSync() {
  return resolve(execSync('git rev-parse --show-toplevel').toString().replace('\n', ''))
}
export function getPackageRootSync() {
  return resolve(execSync('git rev-parse --show-toplevel').toString().replace('\n', ''), 'packages')
}
export function getPackagesSync() {
  const pkgRoot = getPackageRootSync()
  return readdirSync(pkgRoot)
}

// Async calls
export async function getRootAsync() {
  const { stdout } = await execa('git rev-parse --show-toplevel')
  return resolve(stdout)
}
export async function getPackageRootAsync() {
  const { stdout } = await execa('git rev-parse --show-toplevel')
  return resolve(stdout, 'packages')
}
export async function getPackagesAsync() {
  const pkgRoot = await getPackageRootAsync()
  return await readdir(pkgRoot)
}
