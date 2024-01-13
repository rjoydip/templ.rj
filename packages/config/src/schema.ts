import * as v from 'valibot'

export const TemplSchema = v.object({})

export type MaybePromise<T> = T | Promise<T>
export type TemplOptions = v.Output<typeof TemplSchema>
