import { describe, expect, test } from 'vitest'
import { createLogger } from '@templ/logger'
import { TemplSchema } from '../src'

describe('@templ/build > Schema', () => {
  const logger = createLogger()
  describe('CompileTypeSchema', () => {
    test('should validate with valid data', () => {
      expect(TemplSchema.parse({})).toStrictEqual({})
    })
  })
})
