import { describe, expect, test } from 'vitest'
import * as preactJSON from '../../src/ts/preact.json'

describe('@gfft/config > Preact JSON', () => {
  test('display', () => {
    expect(typeof preactJSON.display).toBe('string')
    expect(preactJSON.display).toBe('Preact')
  })
  test('compilerOptions', () => {
    expect(typeof preactJSON.compilerOptions).toBe('object')
    // module
    expect(typeof preactJSON.compilerOptions.module).toBe('string')
    expect(preactJSON.compilerOptions.module).toBe('ES2022')
    // lib
    expect(typeof preactJSON.compilerOptions.lib).toBe('object')
    expect(preactJSON.compilerOptions.lib).toStrictEqual([
      'ES2022',
      'DOM',
      'DOM.Iterable',
    ])
    // moduleResolution
    expect(typeof preactJSON.compilerOptions.moduleResolution).toBe('string')
    expect(preactJSON.compilerOptions.moduleResolution).toBe('bundler')
    // jsx
    expect(typeof preactJSON.compilerOptions.jsx).toBe('string')
    expect(preactJSON.compilerOptions.jsx).toBe('react-jsx')
    // jsxImportSource
    expect(typeof preactJSON.compilerOptions.jsxImportSource).toBe('string')
    expect(preactJSON.compilerOptions.jsxImportSource).toBe('preact')
  })
})
