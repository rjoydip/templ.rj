import { describe, expect, test } from 'vitest'
import * as buildPackage from '../src'

describe('@templ/utils', () => {
  test('should be exported build-package modules', () => {
    expect(buildPackage).toBeDefined()
  })
})
