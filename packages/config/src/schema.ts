import { z } from 'zod'

/* // Constant values
const _outDir = 'dist'
const _tsconfig = 'tsconfig.json'

// Internal primitive schema for reuseable
function arrOptDefu(value: Array<any> = []) {
  return z.array(z.string()).optional().default(value)
}
function boolOptDefu(value: boolean = true) {
  return z.boolean().optional().default(value)
}
const strOptDefu = (value: string = '') => z.string().optional().default(value) */

export type MaybePromise<T> = T | Promise<T>
export type TemplOptions = z.infer<typeof TemplSchema>

export const TemplSchema = z.object({})
