import { z } from 'zod'

export const BuildTypeSchema = z.enum(['esbuild', 'rollup'])
export const FormatSchema = z.enum(['cjs', 'esm', 'iife'])

export const NonBuildOptionSchema = z.object({
  assets: z.array(z.string()).optional().default([]),
  clean: z.boolean().optional().default(true),
  dts: z.boolean().optional().default(true),
  excludes: z.array(z.string()).optional().default([]),
  includes: z.array(z.string()).optional().default([]),
  srcDir: z.string().optional().default('src'),
  type: BuildTypeSchema.optional().default('esbuild'),
  watch: z.boolean().optional().default(false),
})

export const BuildOptionSchema = NonBuildOptionSchema.extend({
  format: z.array(FormatSchema).optional().default(['esm']),
  minify: z.boolean().optional().default(true),
  outDir: z.string().optional().default('dist'),
})
