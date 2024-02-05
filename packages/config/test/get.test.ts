import { describe, expect, it } from 'vitest'
import { getTemplConfigSchema } from '../src'
import { TemplConfigSchema } from '../src/schema'

describe('getTemplConfigSchema', () => {
  // Returns the TemplConfigSchema object when called.
  it('should return the TemplConfigSchema object', () => {
    const result = getTemplConfigSchema()
    expect(result).to.deep.equal(TemplConfigSchema)
  })

  // The function does not throw any errors.
  it('should not throw any errors', () => {
    expect(getTemplConfigSchema).to.not.throw()
  })
})
