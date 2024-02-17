import { beforeAll, describe, expect, expectTypeOf, it } from 'vitest'
import { } from '../src'
import { decoder, encoder } from '../src/utils'

describe('@templ/storage > utils', () => {
  const inputValue = 'foobar'
  let encryptedValue, decryptedValue

  beforeAll(() => {
    encryptedValue = encoder(inputValue)
    decryptedValue = decoder(encryptedValue)
  })

  it('should validate encoder value', () => {
    expect(encoder).toBeDefined()
    expectTypeOf(typeof encoder).toBeString()
    expect(encryptedValue).toBeDefined()
  })
  it('should validate decoder value', () => {
    expect(decoder).toBeDefined()
    expectTypeOf(typeof decoder).toBeString()
    expect(decryptedValue).toStrictEqual(inputValue)
  })
})
