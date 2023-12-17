import type { MaybePromise, TemplOptions } from './schema'

export function defineConfig(options:
  | TemplOptions
  | ((overrideOptions: TemplOptions) => MaybePromise<TemplOptions>)) {
  return options
}

export * from './get-config'
export * from './load'
export * from './schema'
