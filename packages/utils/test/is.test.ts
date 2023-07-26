import { describe, expect, test } from 'vitest'
import { isDefined, isEmpty, isNotDefined, isNotEmpty } from '../src'

describe('@templ/utils > Is', () => {
  test('should match value and type of isDefined', () => {
    const _isDefined = isDefined('1')
    expect(typeof _isDefined).toBe('boolean')
    expect(_isDefined).toBeTruthy()
  })

  test('should match value and type of isNotDefined', () => {
    const _isNotDefined = isEmpty(null)
    expect(typeof _isNotDefined).toBe('boolean')
    expect(_isNotDefined).toBeTruthy()
  })

  test('should match value and type of isEmpty', () => {
    const _isEmpty = isNotDefined(undefined)
    expect(typeof _isEmpty).toBe('boolean')
    expect(_isEmpty).toBeTruthy()
  })

  test('should match value and type of isNotEmpty', () => {
    const _isNotEmpty = isNotEmpty('1')
    expect(typeof _isNotEmpty).toBe('boolean')
    expect(_isNotEmpty).toBeTruthy()
  })
})
