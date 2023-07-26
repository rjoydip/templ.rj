import { describe, expect, test } from 'vitest'
import { CLI_VERSION } from '../src'

describe('@templ/utils > Constants', () => {
  test('should match value and type of CLI_VERSION', () => {
    expect(typeof CLI_VERSION).toBe('string')
    expect(CLI_VERSION).toBe('0.0.1')
  })
})
