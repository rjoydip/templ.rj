import { existsSync } from 'node:fs'
import { join, parse, resolve, sep } from 'node:path'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { argv, cwd } from 'node:process'
import { tmpdir } from 'node:os'
import consola from 'consola'
import { hasProperty, setProperty } from 'dot-prop'
import latestVersion from 'latest-version'
import type { DownloadTemplateOptions } from 'giget'
import { downloadTemplate as dt } from 'giget'
import { shell } from './shell'

export type PM = 'npm' | 'yarn' | 'pnpm' | 'bun'
export const hasDryRun = ($argv?: string[]) => !!($argv ?? argv.slice(2)).includes('--dry-run')
export const capitalize = (s: string) => s && s.charAt(0).toUpperCase() + s.slice(1)

const cache = new Map()

async function pathExists(p: string) {
  try {
    await access(p)
    return true
  }
  catch {
    return false
  }
}

function hasGlobalInstallation(pm: PM): Promise<boolean> {
  const key = `has_global_${pm}`
  if (cache.has(key))
    return Promise.resolve(cache.get(key))

  return shell(pm, ['--version'])
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

export async function getPkgManagers({
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

export async function updateTemplateAssets(options: {
  name: string
  pm: string
  root: string
  dir: string
  replacement?: {
    from?: string
    to?: string
  }
  dotProps?: {
    [x: string]: string | object
  }
} = {
  name: '',
  pm: 'npm',
  root: cwd(),
  dir: cwd(),
  replacement: {
    from: '',
    to: '',
  },
  dotProps: {},
}) {
  let pkgDataRaw = ''
  const { dir, name, pm, root, replacement, dotProps } = options
  const pkgPath = resolve(dir, 'package.json')
  const pkgVersion = await latestVersion(pm)
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

  if (replacement && (hasProperty(replacement, 'from') && hasProperty(replacement, 'to')) && (!!replacement.from && !!replacement.to)) {
    const readmePath = resolve(dir, 'README.md')
    const readmeData = await readFile(readmePath, { encoding: 'utf8' })
    await writeFile(readmePath, readmeData.replace(replacement.from, replacement.to))
    pkgDataRaw = pkgDataRaw.replace(replacement.from, replacement.to)
  }

  const pkgData = JSON.parse(pkgDataRaw)

  setProperty(pkgData, 'name', name)
  setProperty(pkgData, 'packageManager', pm.concat(`@${pkgVersion}`))

  if (dotProps) {
    for (const [key, value] of Object.entries(dotProps))
      setProperty(pkgData, key, value)
  }

  return await writeFile(pkgPath, JSON.stringify(pkgData, null, 2))
}

export async function execute(params: {
  f: string | Promise<string | boolean | number> | Function
  showOutput?: boolean
  showSpinner?: boolean
  title: string
  isSubProcess?: boolean
} = {
  f: '',
  showOutput: true,
  showSpinner: true,
  title: '',
  isSubProcess: false,
}) {
  const { f, showOutput, showSpinner, title, isSubProcess } = params

  consola.log('Here', isSubProcess, f instanceof String)
  if (isSubProcess || f instanceof String) {
    await shell(f.toString(), [])
  }
  else {
    if (showSpinner) {
      try {
        consola.start(`Started ${title}`)
        const output = f instanceof Function ? f() : f instanceof Promise ? await f : null
        consola.success(`Completed ${title}`)
        if (showOutput && output)
          consola.box(output.stdout ?? output.stderr ?? '')
      }
      catch (error) {
        if (showOutput)
          consola.error(String(error))
      }
    }
    else {
      const output = f instanceof Function ? f() : f instanceof Promise ? await f : null
      if (showOutput && output)
        consola.box(output.stdout ?? output.stderr ?? '')
    }
  }
}

export function stackNotes(path: string, isInstalled: boolean = false, pm: string = 'pnpm', showNote: boolean = true) {
  if (showNote)
    consola.box(`cd ${path.replace(`${join(cwd(), '..', '..')}${sep}`, '')}\n${isInstalled ? `${pm.toLowerCase()} dev` : `${pm.toLowerCase()} install\n${pm.toLowerCase()} dev`}`)
}

export async function downloadTemplate(options: {
  repo: string
  dtOps?: DownloadTemplateOptions
} = {
  repo: '',
  dtOps: {},
}) {
  if (!existsSync(options.dtOps?.dir ?? tmpdir()))
    await mkdir(options.dtOps?.dir ?? tmpdir())

  return await dt(options.repo, {
    ...options.dtOps,
  })
}
