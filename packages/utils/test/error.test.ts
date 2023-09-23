import { describe, expect, test } from 'vitest'
import { TemplError } from '../src'

describe('@templ/utils > Error', () => {
  test('should match type of TemplError', () => {
    expect(new TemplError('') instanceof TemplError).toBeTruthy()
  })

  test('should be validate error', () => {
    expect(() => {
      throw new TemplError('Error message')
    }).toThrowError(/Error/)
  })
})
