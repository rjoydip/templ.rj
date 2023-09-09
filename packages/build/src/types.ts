import type { z } from 'zod'
import type { BuildOptionSchema, CompileTypeSchema, DTSPluginSchema, FormatSchema, NonBuildOptionSchema } from './schema'

export type CompileType = z.infer<typeof CompileTypeSchema>
export type Format = z.infer<typeof FormatSchema>

export type NonBuildOptions = z.infer<typeof NonBuildOptionSchema>
export type BuildOptions = z.infer<typeof BuildOptionSchema>
export type DTSPlugin = z.infer<typeof DTSPluginSchema>

export type MaybePromise<T> = T | Promise<T>
