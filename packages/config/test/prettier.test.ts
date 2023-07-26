import { describe, expect, test } from 'vitest'
import { defaultConfig, prettierConfig } from '../src/prettier'

describe('@templ/config > prettier', () => {
  test('should return default configuration', () => {
    expect(prettierConfig()).toEqual(defaultConfig)
  })

  test('should append config', () => {
    expect(
      prettierConfig({
        printWidth: 100,
      }),
    ).toEqual({ ...defaultConfig, printWidth: 100 })
  })
})
