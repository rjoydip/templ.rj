import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = resolve(fileURLToPath(import.meta.url), '../../')
export const pkgRoot = resolve(root, 'packages')
