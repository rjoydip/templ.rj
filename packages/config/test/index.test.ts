import { describe, expect, test } from 'vitest'
import { commitlintConfig, prettierConfig, tsupConfig } from '../src'

describe('@templ/config', () => {
  test('should be exported config modules', () => {
    expect(commitlintConfig).toBeDefined()
    expect(prettierConfig).toBeDefined()
    expect(tsupConfig).toBeDefined()
  })
})
