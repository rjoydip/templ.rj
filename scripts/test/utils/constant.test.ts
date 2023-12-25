import { describe, expect, it } from 'vitest'
import { COMPLETED, STARTED } from '../../src/utils/constant'

describe('scripts > constants', () => {
  it('should match value and type of Started', () => {
    expect(typeof STARTED).toBe('string')
    expect(STARTED).toBe('Started')
  })
  it('should match value and type of Completed', () => {
    expect(typeof COMPLETED).toBe('string')
    expect(COMPLETED).toBe('Completed')
  })
})
