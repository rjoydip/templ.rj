import type { z } from 'zod'

export function isValid(data: any, schema: z.Schema) {
  schema.parse(data)
}
