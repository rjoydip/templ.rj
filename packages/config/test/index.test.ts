import { describe, expect, test } from 'vitest'
import {
  commitlintConfig,
  lintStagedConfig,
  prettierConfig,
  tsupConfig,
} from '../src'

describe('@templ/config', () => {
  test('configs should be exported', () => {
    expect(commitlintConfig).toBeDefined()
    expect(lintStagedConfig).toBeDefined()
    expect(prettierConfig).toBeDefined()
    expect(tsupConfig).toBeDefined()
  })
})
