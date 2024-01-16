import { describe, expect, it } from 'vitest'
import { isDefined, isEmpty, isNotDefined, isNotEmpty } from '../src/index'

describe('@templ/utils > Is', () => {
  it('should match value and type of isDefined', () => {
    const _isDefined = isDefined('1')
    expect(typeof _isDefined).toBe('boolean')
    expect(_isDefined).toBeTruthy()
  })

  it('should match value and type of isNotDefined', () => {
    const _isNotDefined = isEmpty(null)
    expect(typeof _isNotDefined).toBe('boolean')
    expect(_isNotDefined).toBeTruthy()
  })

  it('should match value and type of isEmpty', () => {
    const _isEmpty = isNotDefined(undefined)
    expect(typeof _isEmpty).toBe('boolean')
    expect(_isEmpty).toBeTruthy()
  })

  it('should match value and type of isNotEmpty', () => {
    const _isNotEmpty = isNotEmpty('1')
    expect(typeof _isNotEmpty).toBe('boolean')
    expect(_isNotEmpty).toBeTruthy()
  })
})
