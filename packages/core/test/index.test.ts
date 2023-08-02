import { describe, expect, test } from 'vitest'
import { templ } from '../src'

describe('@templ/core', () => {
  test('should be exported core modules', () => {
    expect(templ).toBeDefined()
  })
})
