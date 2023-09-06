import { describe, expect, test } from 'vitest'
import * as buildPackage from '../src'

describe('@templ/build', () => {
  test('should be exported build-package modules', () => {
    expect(buildPackage).toBeDefined()
  })
})
