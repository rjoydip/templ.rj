import { parse, resolve } from 'node:path'
import { readdir } from 'node:fs/promises'
import { readdirSync } from 'node:fs'
import { cwd } from 'node:process'
import { findUp, findUpSync } from 'find-up'

export function getRootSync() {
  const root = findUpSync('pnpm-workspace.yaml') || findUpSync('.npmrc') || cwd()
  return parse(root).dir
}
export function getPackageRootSync() {
  return resolve(getRootSync() || cwd(), 'packages')
}
export function getPackagesSync() {
  const pkgRoot = getPackageRootSync()
  return readdirSync(pkgRoot)
}

// Async call
export async function getRootAsync() {
  const root = await findUp('pnpm-workspace.yaml') || await findUp('.npmrc') || cwd()
  return parse(root).dir
}
export async function getPackageRootAsync() {
  const root = await getRootAsync()
  return resolve(root, 'packages')
}
export async function getPackagesAsync() {
  const pkgRoot = await getPackageRootAsync()
  return await readdir(pkgRoot)
}
