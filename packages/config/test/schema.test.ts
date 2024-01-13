import { describe, expect, it } from 'vitest'
import * as v from 'valibot'
import { TemplSchema } from '../src'

describe('@templ/build > Schema', () => {
  describe('compileTypeSchema', () => {
    it('should validate with valid data', () => {
      expect(v.parse(TemplSchema, {})).toStrictEqual({})
    })
  })
})
