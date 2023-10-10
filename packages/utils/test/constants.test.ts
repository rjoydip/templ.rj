import { describe, expect, it } from 'vitest'
import { CLI_VERSION, COMPLETED, STARTED } from '../src'

describe('@templ/utils > Constants', () => {
  it('should match value and type of CLI_VERSION', () => {
    expect(typeof CLI_VERSION).toBe('string')
    expect(CLI_VERSION).toBe('0.0.0')
  })
  it('should match value and type of STARTED', () => {
    expect(typeof STARTED).toBe('string')
    expect(STARTED).toBe('STARTED')
  })
  it('should match value and type of COMPLETED', () => {
    expect(typeof COMPLETED).toBe('string')
    expect(COMPLETED).toBe('COMPLETED')
  })
})
