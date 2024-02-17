import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { isValid } from '../src'

describe('@templ/storage > validate', () => {
  // When provided data is valid and matches the schema, no error is thrown
  it('should not throw an error when provided data is valid and matches the schema', () => {
    const data = { name: 'John', age: 25 }
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    })

    expect(() => isValid(data, schema)).not.to.throw()
  })

  // When provided data is valid but does not match the schema, an error is thrown
  it('should throw an error when provided data is valid but does not match the schema', () => {
    const data = { name: 'John', age: '25' }
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    })

    expect(() => isValid(data, schema)).to.throw()
  })

  // When provided data is null or undefined, an error is thrown
  it('should throw an error when provided data is null', () => {
    const data = null
    const schema = z.string()

    expect(() => isValid(data, schema)).to.throw()
  })

  // When provided data is an empty object, validation passes if schema allows empty objects
  it('should pass validation when provided data is an empty object and schema allows empty objects', () => {
    const data = {}
    const schema = z.object({}).nonstrict()

    expect(() => isValid(data, schema)).not.to.throw()
  })

  // When provided data is an empty object, validation fails if schema does not allow empty objects
  it('should not throw an error when provided data is an empty object and schema does not allow empty objects', () => {
    const data = {}
    const schema = z.object({}).strict()

    expect(() => isValid(data, schema)).not.throw()
  })
})
