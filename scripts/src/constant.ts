import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

export const STARTED = 'Started'
export const COMPLETED = 'Completed'

export const DELETE_NODE_MODULES_LOG_MSG = 'Deleting All node modules'
export const PROCESS_LOG_MSG = 'Process'
export const PRE_PROCESS_LOG_MSG = 'Pre Process'
export const POST_PROCESS_LOG_MSG = 'Post Process'

export const ROOT = resolve(execSync('git rev-parse --show-toplevel').toString())
export const PKG_ROOT = resolve(execSync('git rev-parse --show-toplevel').toString(), 'packages')
