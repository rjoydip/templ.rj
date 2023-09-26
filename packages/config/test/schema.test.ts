import { describe, expect, test } from 'vitest'
import { TemplSchema } from '../src'

describe('@templ/build > Schema', () => {
  describe('CompileTypeSchema', () => {
    test('should validate with valid data', () => {
      expect(TemplSchema.parse({})).toStrictEqual({})
    })
  })
})
