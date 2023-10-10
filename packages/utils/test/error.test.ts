import { describe, expect, it } from 'vitest'
import { TemplError } from '../src'

describe('@templ/utils > Error', () => {
  it('should match type of TemplError', () => {
    expect(new TemplError('') instanceof TemplError).toBeTruthy()
  })

  it('should be validate error', () => {
    expect(() => {
      throw new TemplError('Error message')
    }).toThrowError(/Error/)
  })
})
