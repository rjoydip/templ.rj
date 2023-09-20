import { describe, expect, test } from 'vitest'
import { CLI_VERSION, STARTED, COMPLETED } from '../src'

describe('@templ/utils > Constants', () => {
  test('should match value and type of CLI_VERSION', () => {
    expect(typeof CLI_VERSION).toBe('string')
    expect(CLI_VERSION).toBe('0.0.0')
  })
  test('should match value and type of STARTED', () => {
    expect(typeof STARTED).toBe('string')
    expect(STARTED).toBe('STARTED')
  })
  test('should match value and type of COMPLETED', () => {
    expect(typeof COMPLETED).toBe('string')
    expect(COMPLETED).toBe('COMPLETED')
  })
})
