import { parse, resolve, sep } from 'node:path'
import { access, readFile, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { cwd } from 'node:process'
import { log, note, spinner } from '@clack/prompts'
import { hasProperty, setProperty } from 'dot-prop'
import { execa } from 'execa'
import { createRegExp, exactly } from 'magic-regexp'
import colors from 'picocolors'
import latestVersion from 'latest-version'
import { getPackagesDirAsync, getRootDirAsync, getWrappedStr } from '@templ/utils'

interface ExeCommon {
  showOutput?: boolean
  showSpinner?: boolean
  title: string
  isSubProcess?: boolean
}

interface ExeCmdType extends ExeCommon {
  cmd: string
}

interface ExeFnType<T> extends ExeCommon {
  fn: () => Promise<T | null>
}

export type PM = 'npm' | 'yarn' | 'pnpm' | 'bun'

export const ignoreRegex = createRegExp(exactly('node_modules').or('test').or('dist').or('coverage').or('templates'), [])

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

export function getNpmVersion(pm: PM) {
  return execa(pm || 'npm', ['--version']).then(res => res.stdout)
}

export function clearCache() {
  return cache.clear()
}

export function getTypeofLockFile(cwd = '.'): Promise<PM | null> {
  const key = `lockfile_${cwd}`
  if (cache.has(key))
    return Promise.resolve(cache.get(key))

  return Promise.all([
    pathExists(resolve(cwd, 'yarn.lock')),
    pathExists(resolve(cwd, 'package-lock.json')),
    pathExists(resolve(cwd, 'pnpm-lock.yaml')),
    pathExists(resolve(cwd, 'bun.lockb')),
  ]).then(([isYarn, isNpm, isPnpm, isBun]) => {
    let value: PM | null = null

    if (isYarn)
      value = 'yarn'

    else if (isPnpm)
      value = 'pnpm'

    else if (isBun)
      value = 'bun'

    else if (isNpm)
      value = 'npm'

    cache.set(key, value)
    return value
  })
}

export async function getPackageManagers({
  includeGlobalBun,
}: { cwd?: string, includeGlobalBun?: boolean } = {}) {
  const pms = ['npm']

  const [hasYarn, hasPnpm, hasBun] = await Promise.all([
    hasGlobalInstallation('yarn'),
    hasGlobalInstallation('pnpm'),
    includeGlobalBun && hasGlobalInstallation('bun'),
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
  const pkgRoot = await getPackagesDirAsync()
  return await readdir(pkgRoot)
}

export async function exeCmd(params: ExeCmdType = {
  cmd: '',
  showOutput: true,
  showSpinner: true,
  title: '',
  isSubProcess: false,
}) {
  const { cmd, showOutput, showSpinner, title, isSubProcess } = params
  let output = {
    stdout: '',
    stderr: '',
  }

  if (isSubProcess) {
    await execa(cmd, {
      stdio: 'inherit',
    })
  }
  else {
    if (showSpinner) {
      const s = spinner()
      s.start(`Started ${title}`)
      output = await execa(cmd)
      s.stop(`Completed ${title}`)
    }
    else {
      output = await execa(cmd)
    }
  }

  if (showOutput) {
    if (output.stdout)
      note(getWrappedStr(output.stdout), `${title}`)
    if (output.stderr)
      log.error(getWrappedStr(colors.red(output.stderr)))
  }
}

export async function executeFn<T>(params: ExeFnType<T> = {
  fn: async () => null,
  showOutput: true,
  showSpinner: true,
  title: '',
}) {
  const { fn, showOutput, showSpinner, title } = params
  let output = null
  if (showSpinner) {
    const s = spinner()
    s.start(`Started ${title}`)
    output = await fn()
    s.stop(`Completed ${title}`)
  }
  else {
    output = await fn()
  }
  if (showOutput) {
    if (output)
      note(getWrappedStr((output ?? '').toString()), `${title}`)
  }
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
  const root = await getRootDirAsync()
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

    const regExp = createRegExp(exactly(replacement.from), ['g', 'm'])
    await writeFile(readmePath, readmeData.replace(regExp, replacement.to))

    pkgDataRaw = pkgDataRaw.replace(regExp, replacement.to)
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

export async function createJSON(path: string = cwd(), data: object = {}, prop: string = '', value = '') {
  const _data = data
  if (!existsSync(path))
    throw new Error('Path not exists')

  if (typeof _data === 'string')
    throw new Error('Data can\'t be string')

  if (hasProperty(data, 'name'))
    throw new Error('JSON is empty')

  if (prop && value)
    setProperty(data, prop, value)

  return await writeFile(path, JSON.stringify(_data, null, 2))
}
