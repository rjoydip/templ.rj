import { resolve } from 'node:path'
import { argv, cwd } from 'node:process'
import { globby } from 'globby'

const unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
export const ignorePatterns = ['.git/**', '**/node_modules/**', '**/templates/**', '**/fixtures/**', '*templ.mjs', '*.code-workspace']
export const hasDryRun = (_argv: string[] = argv.slice(2)) => !!_argv.includes('--dry-run')

export function prettyBytes(bytes: number) {
  if (bytes === 0)
    return '0 B'
  const exp = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** exp).toFixed(2)} ${unit[exp]}`
}

export function prettyBytesToNumber(prettyBytes: string = '') {
  const bytes = Number(prettyBytes.replace(/[^0-9.]/g, ''))
  const exp = prettyBytes.replace(/[0-9.\s]/g, '')
  if (bytes === 0 || Number.isNaN(bytes))
    return 0
  if (bytes < 1024 && exp === 'B')
    return bytes
  return Math.ceil((bytes * 1024) * (unit.indexOf(exp)))
}

export async function getPackagesAsync() {
  return await globby(['packages/**/dist/index.js'], {
    ignore: ignorePatterns,
    cwd: resolve(cwd(), '..'),
    markDirectories: true,
  })
}
