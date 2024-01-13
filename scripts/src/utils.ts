import { parse, resolve } from 'node:path'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { readdirSync } from 'node:fs'
import { cwd } from 'node:process'
import { log, note, spinner } from '@clack/prompts'
import { execa } from 'execa'
import { findUp, findUpSync } from 'find-up'
import { createRegExp, exactly } from 'magic-regexp'
import colors from 'picocolors'
import latestVersion from 'latest-version'
import wrapAnsi from 'wrap-ansi'

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

export const ignoreRegex = createRegExp(exactly('node_modules').or('test').or('dist').or('coverage').or('templates'), [])

export function getRootDirSync() {
  const root = findUpSync('pnpm-workspace.yaml') || findUpSync('.npmrc') || cwd()
  return parse(root).dir
}
export async function getRootDirAsync() {
  const root = await findUp('pnpm-workspace.yaml') || await findUp('.npmrc') || cwd()
  return parse(root).dir
}

export function getPackagesDirSync() {
  return resolve(getRootDirSync(), 'packages')
}
export async function getPackagesDirAsync() {
  const root = await getRootDirAsync()
  return resolve(root, 'packages')
}
export function getArtifactsDirSync() {
  return resolve(getRootDirSync(), 'artifacts')
}
export async function getArtifactsDirAsync() {
  const root = await getRootDirAsync()
  return resolve(root, 'artifacts')
}

export function getPackagesSync() {
  const pkgRoot = getPackagesDirSync()
  return readdirSync(pkgRoot)
}

export async function getPackagesAsync() {
  const pkgRoot = await getPackagesDirAsync()
  return await readdir(pkgRoot)
}

export function getWrappedStr(msg: string, column: number = 100) {
  return wrapAnsi(msg, column)
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
  from: string
  to: string
} = {
  from: '',
  to: '',
}) {
  const shouldReplaced = !!replacement.from && !!replacement.to
  const pkgPath = resolve(dest, 'package.json')
  const pkgVersion = await latestVersion(packageManager)

  let pkgDataRaw = await readFile(pkgPath, { encoding: 'utf8' })

  if (shouldReplaced) {
    const regExp = createRegExp(exactly(replacement.from), ['g', 'm'])
    const readmePath = resolve(dest, 'README.md')
    const readmeData = await readFile(readmePath, { encoding: 'utf8' })

    await writeFile(readmePath, readmeData.replace(regExp, replacement.to))

    pkgDataRaw = pkgDataRaw.replace(regExp, replacement.to)
  }

  const pkgData = JSON.parse(pkgDataRaw)

  pkgData.name = name
  pkgData.packageManager = packageManager.concat(`@${pkgVersion}`)

  if (pkgData.description)
    pkgData.description = ''

  if (pkgData.repository)
    pkgData.repository = ''

  return await writeFile(pkgPath, JSON.stringify(pkgData, null, 2))
}
