import { describe, expect, it } from 'vitest'
import { getWrappedStr } from '../src'

describe('string', () => {
  it('should be validated getWrappedStr', () => {
    const str = 'The quick brown fox jumped over the lazy dog and then ran away with the unicorn.'
    expect((getWrappedStr(str, 20).split('\n'))[0].length).toBe(19)
  })
})
