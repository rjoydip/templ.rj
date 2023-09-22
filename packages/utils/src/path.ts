import { fileURLToPath } from 'node:url'
import { basename } from 'node:path'
import escalade from 'escalade'

export const root = await escalade(fileURLToPath(import.meta.url), (dir) => {
  if (basename(dir) === 'templ')
    return dir
}) || ''
export const pkgRoot = await escalade(fileURLToPath(import.meta.url), (dir) => {
  if (basename(dir) === 'packages')
    return dir
}) || ''
