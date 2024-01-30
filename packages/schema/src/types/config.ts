import type { SnakeCase } from 'scule'

export type { SchemaDefinition } from 'untyped'
export type DeepPartial<T> = T extends Function ? T : T extends Record<string, any> ? { [P in keyof T]?: DeepPartial<T[P]> } : T
export type UpperSnakeCase<S extends string> = Uppercase<SnakeCase<S>>
const message = Symbol('message')
export type RuntimeValue<T, B extends string> = T & { [message]?: B }
type Overrideable<T extends Record<string, any>, Path extends string = ''> = {
  [K in keyof T]?: K extends string
    ? unknown extends T[K]
      ? unknown
      : T[K] extends Record<string, unknown>
        ? RuntimeValue<Overrideable<T[K], `${Path}_${UpperSnakeCase<K>}`>, `You can override this value at runtime with NUXT${Path}_${UpperSnakeCase<K>}`>
        : RuntimeValue<T[K], `You can override this value at runtime with NUXT${Path}_${UpperSnakeCase<K>}`>
    : K extends number
      ? T[K]
      : never
}
// Runtime Config
interface ConfigSchema {}
// TODO: Expose ConfigLayer<T> from c12
interface ConfigLayer<T> {
  config: T
  cwd: string
  configFile: string
}
type RuntimeConfigNamespace = Record<string, unknown>
export interface PublicRuntimeConfig extends RuntimeConfigNamespace { }
export interface RuntimeConfig extends RuntimeConfigNamespace {
  public: PublicRuntimeConfig
}
export type TemplConfigLayer = ConfigLayer<TemplConfig & {
  srcDir: string
  rootDir: string
}>
// User configuration in `templ.config` file
export interface TemplConfig extends Omit<ConfigSchema, 'runtimeConfig'> {
  runtimeConfig?: Overrideable<RuntimeConfig>
}
export interface TemplBuilder {
  bundle: (p: string) => Promise<void>
}
// Normalized Templ options available as `templ.options.*`
export interface TemplOptions {
  sourcemap: boolean
  builder: 'esbuild' | 'unbuildr' | 'vite' | TemplBuilder
  layers: TemplConfigLayer[]
}
