import { z } from 'zod'

// Constant values
const _outDir = 'dist'
const _tsconfig = 'tsconfig.json'

// Enum values
export const CompileTypeSchema = z.enum(['esbuild', 'rollup'])
export const FormatSchema = z.enum(['cjs', 'esm', 'iife'])

// Internal primitive schema for reuseable
function arrOptDefu(value: Array<any> = []) {
  return z.array(z.string()).optional().default(value)
}
function boolOptDefu(value: boolean = true) {
  return z.boolean().optional().default(value)
}
const strOptDefu = (value: string = '') => z.string().optional().default(value)

export const LoggerSchema = z.object({
  setName: z.function(),
  success: z.function(),
  info: z.function(),
  error: z.function(),
  warn: z.function(),
  log: z.function(),
})

// Schemas
export const NonBuildSchema = z.object({
  assets: arrOptDefu(),
  clean: boolOptDefu(true),
  bundler: CompileTypeSchema.optional().default('esbuild'),
  debug: boolOptDefu(false),
  dts: boolOptDefu(true),
  exclude: arrOptDefu(),
  include: arrOptDefu(),
  srcDir: z.string().optional().default('src'),
  tsconfig: strOptDefu(_tsconfig),
  watch: boolOptDefu(false),
  logger: LoggerSchema,
})

export const BuildSchema = NonBuildSchema.extend({
  bundle: boolOptDefu(true),
  format: z.array(FormatSchema).optional().default(['cjs']),
  minify: boolOptDefu(true),
  outDir: strOptDefu(_outDir),
  outFile: strOptDefu('out.js'),
  target: strOptDefu('esnext'),
})

export const DTSPluginSchema = z.object({
  debug: boolOptDefu(false),
  outDir: strOptDefu(_outDir),
  tsconfig: strOptDefu(_tsconfig),
})

export const TemplSchema = z.object({
  build: BuildSchema,
  logger: LoggerSchema,
})

export type MaybePromise<T> = T | Promise<T>
export type TemplOptions = z.infer<typeof TemplSchema>

export type CompileType = z.infer<typeof CompileTypeSchema>
export type Format = z.infer<typeof FormatSchema>

export type NonBuildOptions = z.infer<typeof NonBuildSchema>
export type BuildOptions = z.infer<typeof BuildSchema>
export type DTSPlugin = z.infer<typeof DTSPluginSchema>
