import { fileURLToPath } from 'node:url'
import { basename } from 'node:path'
import escalade from '../src/escalade/async'

export const root = await escalade(fileURLToPath(import.meta.url), (dir: any) => basename(dir) === 'templ' ? dir : '')
export const pkgRoot = await escalade(fileURLToPath(import.meta.url), (dir: any) => basename(dir) === 'packages' ? dir : '')
