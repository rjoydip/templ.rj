import type { MaybePromise, TemplOptions } from './schema'

export const defineConfig = (
  options:
    | TemplOptions
    | ((overrideOptions: TemplOptions) => MaybePromise<TemplOptions>),
) => options

export * from './get-config'
export * from './load'
export * from './tsup'
export * from './schema'
