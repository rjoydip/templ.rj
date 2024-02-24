import { describe, expect, it } from 'vitest'
import * as config from '../src/index'

describe('@templ/config > load config', () => {
  it('should be exported config modules', () => {
    expect(config).toBeDefined()
  })
})
