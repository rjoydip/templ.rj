import { describe, expect, test } from 'vitest'
import { Templ } from '../src'

describe('@templ/ui', () => {
  test('should be exported ui modules', () => {
    expect(Templ).toBeDefined()
  })
})
