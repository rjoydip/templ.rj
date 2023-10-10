import { describe, expect, it } from 'vitest'
import { templ } from '../src'

describe('@templ/core', () => {
  it('should be exported core modules', () => {
    expect(templ).toBeDefined()
  })
})
