import type { z } from 'zod'

/**
 * Validates the provided data against the given schema.
 *
 * @param {any} data - the data to be validated
 * @param {z.Schema} schema - the schema to validate against
 * @return {void}
 */
export function isValid(data: any, schema: z.Schema) {
  schema.parse(data)
}
