import { describe, expect, it } from 'vitest'
import { ignorePatterns, patterns } from '../src/index'

describe('patterns', () => {
  it('should be validated delete patterns', () => {
    expect(patterns).toBeDefined()
    expect(patterns.length).toBe(3)
    expect(patterns).toContain('**/coverage/**')
  })

  it('should be validated delete ignore patterns', () => {
    expect(ignorePatterns).toBeDefined()
    expect(ignorePatterns.length).toBe(6)
    expect(ignorePatterns).toContain('**/node_modules/**')
  })
})
