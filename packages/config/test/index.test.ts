import { describe, expect, test } from 'vitest'
import { tsupDefaultConfig } from '../src'

describe('@templ/config', () => {
  test('should be exported config modules', () => {
    expect(tsupDefaultConfig).toBeDefined()
  })
})
