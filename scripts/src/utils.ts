import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { cwd } from 'node:process'
import { COMPLETED, STARTED } from './constant.js'

const $ = promisify(exec)

export async function execCmd(cmd: string, ops: {
  msg: string
  cwd?: string
} = {
  msg: '',
  cwd: cwd(),
}) {
  console.log(`[${STARTED}]: ${ops.msg}`)
  await $(cmd, {
    cwd: ops.cwd,
  })
  console.log(`[${COMPLETED}]: ${ops.msg}`)
}
