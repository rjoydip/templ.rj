import { cwd } from 'node:process'
import { defaultTemplConfig } from './_default'
import { loadTemplConfig } from './load'

export async function getBuildConfig(_cwd?: string) {
  const { data } = await loadTemplConfig(_cwd ?? cwd())
  // @ts-expect-error-next-line
  return data?.build ?? defaultTemplConfig.build
}
