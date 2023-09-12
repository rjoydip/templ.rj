import type { MaybePromise, Options } from './schema'

export const defineConfig = (
  options:
  | Options
  | Options[]
  | ((overrideOptions: Options) => MaybePromise<Options | Options[]>),
) => options

export * from './load'
export * from './tsup'
export * from './schema'
