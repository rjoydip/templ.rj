import { describe, expect, it } from 'vitest'
import { TemplSchema } from '../src'

describe('@templ/build > Schema', () => {
  describe('compileTypeSchema', () => {
    it('should validate with valid data', () => {
      expect(TemplSchema.parse({})).toStrictEqual({})
    })
  })
})
