import { describe, expect, test } from 'vitest'
const reactJSON = require('../../src/ts/react.json')

describe('@templ/config > react JSON', () => {
  test('display', () => {
    expect(typeof reactJSON.display).toBe('string')
    expect(reactJSON.display).toBe('React')
  })
  test('compilerOptions', () => {
    expect(typeof reactJSON.compilerOptions).toBe('object')
    // module
    expect(typeof reactJSON.compilerOptions.module).toBe('string')
    expect(reactJSON.compilerOptions.module).toBe('ES2022')
    // lib
    expect(typeof reactJSON.compilerOptions.lib).toBe('object')
    expect(reactJSON.compilerOptions.lib).toStrictEqual([
      'ES2022',
      'DOM',
      'DOM.Iterable',
    ])
    // moduleResolution
    expect(typeof reactJSON.compilerOptions.moduleResolution).toBe('string')
    expect(reactJSON.compilerOptions.moduleResolution).toBe('bundler')
    // jsx
    expect(typeof reactJSON.compilerOptions.jsx).toBe('string')
    expect(reactJSON.compilerOptions.jsx).toBe('react')
  })
})
