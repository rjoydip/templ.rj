import { describe, expect, test } from 'vitest'
import * as utils from '../src'

describe('@templ/utils', () => {
  test('should be exported utils modules', () => {
    expect(utils).toBeDefined()
  })
})
