import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
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

export const ROOT = resolve(execSync('git rev-parse --show-toplevel').toString())
export const PKG_ROOT = resolve(execSync('git rev-parse --show-toplevel').toString(), 'packages')
