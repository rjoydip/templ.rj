import { describe, expect, test } from 'vitest'
import { commitlintConfig, defaultConfig } from '../src/commitlint'

describe('@templ/config > commitlint', () => {
  test('should return default configuration', () => {
    expect(commitlintConfig()).toEqual(defaultConfig)
  })

  test('should return default configuration with different extends', () => {
    expect(
      commitlintConfig(
        {
          extends: ['other-config'],
        },
        {
          arrayMerge: 'overwrite',
        },
      ),
    ).toEqual({ ...defaultConfig, extends: ['other-config'] })
  })
})
