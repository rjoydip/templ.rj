import { cwd } from 'node:process'
import { loadTemplConfig } from './load'

export async function getBuildConfig(_cwd?: string) {
  const { data } = await loadTemplConfig(_cwd ?? cwd())
  return data
}
