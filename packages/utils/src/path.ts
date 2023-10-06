import { fileURLToPath } from 'node:url'
import { basename } from 'node:path'
import { escaladeAsync } from '../src/escalade'

export const root = await escaladeAsync(fileURLToPath(import.meta.url), (dir: any) => basename(dir) === 'templ' ? dir : '')
export const pkgRoot = await escaladeAsync(fileURLToPath(import.meta.url), (dir: any) => basename(dir) === 'packages' ? dir : '')
