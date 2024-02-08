import { existsSync } from 'node:fs'
import { join, parse, resolve, sep } from 'node:path'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { argv, cwd } from 'node:process'
import { tmpdir } from 'node:os'
import consola from 'consola'
import { hasProperty, setProperty } from 'dot-prop'
import latestVersion from 'latest-version'
import type { DownloadTemplateOptions } from 'giget'
import { downloadTemplate as dt } from 'giget'
import { shell } from './shell'

export const hasDryRun = ($argv?: string[]) => !!($argv ?? argv.slice(2)).includes('--dry-run')
export const capitalize = (s: string) => s && s.charAt(0).toUpperCase() + s.slice(1)

export async function updateTemplateAssets(options: {
  name: string
  pm?: string
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
  pm: 'pnpm',
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
  const pkgVersion = await latestVersion(pm!)
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
  setProperty(pkgData, 'packageManager', pm?.concat(`@${pkgVersion}`))

  if (dir.match('packages'))
    setProperty(pkgData, 'size-limit', '1024 B')

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

export function stackNotes(opts: {
  path?: string
  isInstalled?: boolean
  pm?: string
  showNote?: boolean
} = {
  isInstalled: false,
  pm: 'pnpm',
  showNote: true,
}) {
  if (opts.showNote)
    consola.box(`cd ${(opts.path ?? cwd()).replace(`${join(cwd(), '..', '..')}${sep}`, '')}\n${opts.isInstalled ? `${opts.pm?.toLowerCase()} dev` : `${opts.pm?.toLowerCase()} install\n${opts.pm?.toLowerCase()} dev`}`)
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
