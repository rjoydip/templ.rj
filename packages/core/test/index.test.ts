import { describe, expect, test } from 'vitest'
import { templ } from '../src'

describe('@templ/core', () => {
  test('core should be exported', () => {
    expect(templ).toBeDefined()
  })
})
