import { z } from 'zod'

// Constant values
const _outDir = 'dist'
const _tsconfig = 'tsconfig.json'

// Enum values
export const CompileTypeSchema = z.enum(['esbuild', 'rollup'])
export const FormatSchema = z.enum(['cjs', 'esm', 'iife'])

// Internal premitive schema for reuseable
const arrOptDefu = (value: Array<any> = []) => z.array(z.string()).optional().default(value)
const boolOptDefu = (value: boolean = true) =>  z.boolean().optional().default(value)
const strOptDefu = (value: string = '') =>  z.string().optional().default(value)

export const LoggerSchema = z.object({
  setName: z.function(),
  success: z.function(),
  info: z.function(),
  error: z.function(),
  warn: z.function(),
  log: z.function(),
})

// Schemas
export const NonBuildOptionSchema = z.object({
  assets: arrOptDefu(),
  clean: boolOptDefu(true),
  compile: CompileTypeSchema.optional().default('esbuild'),
  debug: boolOptDefu(false),
  dts: boolOptDefu(true),
  exclude: arrOptDefu(),
  include: arrOptDefu(),
  srcDir: z.string().optional().default('src'),
  tsconfig: strOptDefu(_tsconfig),
  watch: boolOptDefu(false),
  logger: LoggerSchema
})

export const BuildOptionSchema = NonBuildOptionSchema.extend({
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
