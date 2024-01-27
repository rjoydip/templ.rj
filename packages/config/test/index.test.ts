import { resolve } from 'node:path'
import * as v from 'valibot'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { TemplSchema, getBuild } from '../src'

const fixture = (folder: string) => resolve(__dirname, 'fixtures', folder)

describe('@templ/config', () => {
  it('should be validate build data', async () => {
    expect(await getBuild(fixture('1'))).toStrictEqual({})
  })

  describe('compileTypeSchema', () => {
    it('should validate with valid schema', () => {
      expect(v.parse(TemplSchema, {})).toStrictEqual({})
      expectTypeOf(v.parse(TemplSchema, {})).toEqualTypeOf<NonNullable<unknown>>()
    })
  })
})
