import { describe, expect, test } from 'vitest'
import { tsupConfig } from '../src'

describe('@templ/config', () => {
  test('should be exported config modules', () => {
    expect(tsupConfig).toBeDefined()
  })
})
