import { describe, expectTypeOf, it } from 'vitest'
import { getConf, getEnv, geteFF, isValid } from '../src'

describe('@templ/storage > index', () => {
  it('should validate isValid function', () => {
    expectTypeOf(isValid).toBeFunction()
    expectTypeOf(isValid).parameter(0).toBeAny()
    expectTypeOf(isValid).parameter(1).toBeObject()
  })

  it('should validate getFF function', () => {
    expectTypeOf(geteFF).toBeFunction()
    expectTypeOf(geteFF).parameter(0).toBeString()
    expectTypeOf(geteFF).parameter(1).toBeObject()
  })

  it('should validate getEnv function', () => {
    expectTypeOf(getEnv).toBeFunction()
    expectTypeOf(getEnv).parameter(0).toBeString()
  })

  it('should validate getConf function', () => {
    expectTypeOf(getConf).toBeFunction()
    expectTypeOf(getConf).parameter(0).toBeString()
  })
})
