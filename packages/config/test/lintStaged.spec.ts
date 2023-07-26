import { describe, expect, test } from 'vitest'
import { defaultConfig, lintStagedConfig } from '../src/lintStaged'

describe('@gfft/config > lintStaged', () => {
  test('should return default configuration', () => {
    expect(lintStagedConfig()).toEqual(defaultConfig)
  })

  test('should append a config', () => {
    expect(
      lintStagedConfig({
        '.js': 'eslint --fix',
      })
    ).toEqual({ ...defaultConfig, '.js': 'eslint --fix' })
  })
})
