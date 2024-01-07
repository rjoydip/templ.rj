import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

export const root = resolve(execSync('git rev-parse --show-toplevel').toString())
export const pkgRoot = resolve(root, 'packages')
export const appsRoot = resolve(root, 'apps')
export const scriptsRoot = resolve(root, 'scripts')
