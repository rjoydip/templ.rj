import type { z } from 'zod'
import type { BuildOptionSchema, BuildTypeSchema, FormatSchema, NonBuildOptionSchema } from './schema'

export type BuildType = z.infer<typeof BuildTypeSchema>
export type Format = z.infer<typeof FormatSchema>

export type NonBuildOptions = z.infer<typeof NonBuildOptionSchema>
export type BuildOptions = z.infer<typeof BuildOptionSchema>
