import { describe, expect, test } from 'vitest'
import { PrettyError } from '../src'

describe('@templ/utils > Error', () => {
  test('should match type of PrettyError', () => {
    expect(new PrettyError('') instanceof PrettyError).toBeTruthy()
  })

  test('should be validate error', () => {
    expect(() => {
      throw new PrettyError('Error message')
    }).toThrowError(/Error/)
  })
})
