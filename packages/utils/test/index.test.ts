import { describe, expect, it } from 'vitest'
import * as utils from '../src/index'

describe('@templ/utils', () => {
  it('should be exported utils modules', () => {
    expect(utils).toBeDefined()
  })
})
