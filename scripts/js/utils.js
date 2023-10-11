import { exec } from 'node:child_process'
import util from 'node:util'
import { COMPLETED, STARTED } from './constant'

const $ = util.promisify(exec)

export async function execCmd(cmd, ops = {
  msg: '',
}) {
  console.log(`[${STARTED}]: ${ops.msg}`)
  await $(cmd)
  console.log(`[${COMPLETED}]: ${ops.msg}`)
}
