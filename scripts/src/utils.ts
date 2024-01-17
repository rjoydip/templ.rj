import { parse, resolve, sep } from 'node:path'
import { access, readFile, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { cwd } from 'node:process'
import { log, note, spinner } from '@clack/prompts'
import { hasProperty, setProperty } from 'dot-prop'
import { execa } from 'execa'
import colors from 'picocolors'
import latestVersion from 'latest-version'
import wrapAnsi from 'wrap-ansi'

interface ExeCommon {
  showOutput?: boolean
  showSpinner?: boolean
  title: string
  isSubProcess?: boolean
}

interface ExecuteCmd extends ExeCommon {
  cmd: string
}

interface ExecuteFn extends ExeCommon {
  fn: () => Promise<any> | any
}

type PM = 'npm' | 'yarn' | 'pnpm' | 'bun'

const unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
export const ignorePatterns = ['.git/**', '**/node_modules/**', 'templates/**', '**/fixtures/**', '*templ.mjs', '*.code-workspace']

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

async function pathExists(p: string) {
  try {
    await access(p)
    return true
  }
  catch {
    return false
  }
}

const cache = new Map()

function hasGlobalInstallation(pm: PM): Promise<boolean> {
  const key = `has_global_${pm}`
  if (cache.has(key))
    return Promise.resolve(cache.get(key))

  return execa(pm, ['--version'])
    .then((res) => {
      return /^\d+.\d+.\d+$/.test(res.stdout)
    })
    .then((value) => {
      cache.set(key, value)
      return value
    })
    .catch(() => false)
}

async function getTypeofLockFile(cwd = '.'): Promise<PM> {
  const key = `lockfile_${cwd}`
  if (cache.has(key))
    return Promise.resolve(cache.get(key))

  const [isYarn, isNpm, isPnpm, isBun] = await Promise.all([
    pathExists(resolve(cwd, 'yarn.lock')),
    pathExists(resolve(cwd, 'package-lock.json')),
    pathExists(resolve(cwd, 'pnpm-lock.yaml')),
    pathExists(resolve(cwd, 'bun.lockb')),
  ])

  let value: PM | null = null

  if (isYarn)
    value = 'yarn'

  else if (isPnpm)
    value = 'pnpm'

  else if (isBun)
    value = 'bun'

  else if (isNpm)
    value = 'npm'

  else
    value = 'npm'
  cache.set(key, value)
  return value
}

export async function getPackageManagers({
  cwd,
  incldeGlobaBun,
  includeLocal,
}: { cwd?: string, incldeGlobaBun?: boolean, includeLocal?: boolean } = {}): Promise<PM[]> {
  const pms: PM[] = []

  if (includeLocal && cwd) {
    const localPM = await getTypeofLockFile(cwd)
    return [localPM]
  }

  const [hasYarn, hasPnpm, hasBun] = await Promise.all([
    hasGlobalInstallation('yarn'),
    hasGlobalInstallation('pnpm'),
    incldeGlobaBun && hasGlobalInstallation('bun'),
  ])

  if (hasYarn)
    pms.push('yarn')

  if (hasPnpm)
    pms.push('pnpm')

  if (hasBun)
    pms.push('bun')

  return pms
}
export async function getPackagesAsync() {
  return await readdir(resolve(cwd(), '..', 'packages'))
}

export function getWrappedStr(msg: string, column: number = 100) {
  return wrapAnsi(msg, column)
}

function showTerminalOutput(output: {
  stdout: string
  stderr: string
} = {
  stdout: 'All good',
  stderr: 'Something wrong',
}, title: string) {
  if (title)
    note(getWrappedStr(output.stdout ?? output.stderr), `${title}`)
  else
    note(getWrappedStr(output.stdout ?? output.stderr))
}

export async function exeCmd(params: ExecuteCmd = {
  cmd: '',
  showOutput: true,
  showSpinner: true,
  title: '',
  isSubProcess: false,
}) {
  const s = spinner()
  const { cmd, showOutput, showSpinner, title, isSubProcess } = params

  if (isSubProcess) {
    await execa(cmd, {
      stdio: 'inherit',
    })
  }
  else {
    if (showSpinner) {
      try {
        s.start(`Started ${title}`)
        const output = await execa(cmd)
        s.stop(`Completed ${title}`)
        if (showOutput)
          showTerminalOutput(output, title)
      }
      catch (error) {
        s.stop(`Error ${colors.red(title)}`)
        log.error(String(error))
      }
    }
    else {
      const output = await execa(cmd)

      if (showOutput)
        showTerminalOutput(output, title)
    }
  }
}

export async function executeFn(params: ExecuteFn = {
  fn: () => null,
  showOutput: true,
  showSpinner: true,
  title: '',
}) {
  const s = spinner()
  const { fn, showOutput, showSpinner, title } = params
  const output = {
    stdout: '',
    stderr: '',
  }
  if (showSpinner) {
    s.start(`Started ${title}`)
    output.stdout = await fn()
    s.stop(`Completed ${title}`)
  }
  else {
    output.stderr = await fn()
  }
  if (showOutput)
    showTerminalOutput(output, title)
}

export function stackNotes(path: string, isInstalled: boolean = false, packageManager: string = 'pnpm', showNote: boolean = true) {
  if (showNote)
    note(getWrappedStr(`cd ${path}\n${isInstalled ? `${packageManager} dev` : `${packageManager} install\n${packageManager} dev`}`), 'Next steps.')
}

export async function updateTemplateAssets(name: string = '', packageManager: string = 'pnpm', dest: string = cwd(), replacement: {
  from?: string | null
  to?: string | null
} = {
  from: null,
  to: null,
}, dotProps: object = {}) {
  let pkgDataRaw = ''
  const pkgPath = resolve(dest, 'package.json')
  const root = resolve(cwd(), '..')
  const pkgVersion = await latestVersion(packageManager)

  if (!existsSync(pkgPath)) {
    const json = {}
    if (!hasProperty(json, 'name')) {
      setProperty(json, 'name', '')
      setProperty(json, 'type', 'module')
      setProperty(json, 'version', '0.0.0')
      setProperty(json, 'private', true)
      setProperty(json, 'packageManager', '')
      setProperty(json, 'description', '')
      setProperty(json, 'license', 'MIT')
      setProperty(json, 'homepage', `https://github.com/rjoydip/templ/tree/main/${name}/#readme`)
      setProperty(json, 'repository', {
        type: 'git',
        url: 'git+https://github.com/rjoydip/templ.git',
        directory: `${parse(pkgPath).dir.replace(`${root}${sep}`, '').replace(sep, '/')}`,
      })
      setProperty(json, 'bugs', {
        url: 'https://github.com/rjoydip/templ/issues',
      })
      setProperty(json, 'engines', {
        node: '^18.8.0 || >=20.6.0',
        npm: '>=8',
      })
      setProperty(json, 'scripts', {})
      setProperty(json, 'dependencies', {})
      setProperty(json, 'devDependencies', {})
    }
    pkgDataRaw = JSON.stringify(json, null, 2)
    await writeFile(pkgPath, pkgDataRaw)
  }
  else {
    pkgDataRaw = await readFile(pkgPath, { encoding: 'utf8' })
  }

  if ((hasProperty(replacement, 'from') && hasProperty(replacement, 'to')) && (!!replacement.from && !!replacement.to)) {
    const readmePath = resolve(dest, 'README.md')
    const readmeData = await readFile(readmePath, { encoding: 'utf8' })

    await writeFile(readmePath, readmeData.replace(replacement.from, replacement.to))

    pkgDataRaw = pkgDataRaw.replace(replacement.from, replacement.to)
  }

  const pkgData = JSON.parse(pkgDataRaw)

  setProperty(pkgData, 'name', name)
  setProperty(pkgData, 'packageManager', packageManager.concat(`@${pkgVersion}`))

  if (dotProps) {
    for (const [key, value] of Object.entries(dotProps))
      setProperty(pkgData, key, value)
  }

  return await writeFile(pkgPath, JSON.stringify(pkgData, null, 2))
}
