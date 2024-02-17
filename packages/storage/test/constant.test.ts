import { describe, expect, expectTypeOf, it } from 'vitest'
import { prefix } from '../src'

describe('@templ/storage > constant', () => {
  it('should be valid prefix', () => {
    expect(prefix.conf).toStrictEqual('conf')
    expectTypeOf(prefix.conf).toBeString()
    expect(prefix.env).toStrictEqual('env')
    expectTypeOf(prefix.env).toBeString()
    expect(prefix.ff).toStrictEqual('ff')
    expectTypeOf(prefix.ff).toBeString()
  })
})
