import { describe, expect, test } from 'vitest'
import * as nodeJSON from '../../src/ts/node.json'

describe('@templ/config > Base JSON', () => {
  test('display', () => {
    expect(typeof nodeJSON.display).toBe('string')
    expect(nodeJSON.display).toBe('Node')
  })
  test('compilerOptions', () => {
    expect(typeof nodeJSON.compilerOptions).toBe('object')
    // module
    expect(typeof nodeJSON.compilerOptions.module).toBe('string')
    expect(nodeJSON.compilerOptions.module).toBe('esnext')
    // lib
    expect(typeof nodeJSON.compilerOptions.lib).toBe('object')
    expect(nodeJSON.compilerOptions.lib).toStrictEqual(['esnext'])
    // moduleResolution
    expect(typeof nodeJSON.compilerOptions.moduleResolution).toBe('string')
    expect(nodeJSON.compilerOptions.moduleResolution).toBe('node')
    // types
    expect(typeof nodeJSON.compilerOptions.types).toBe('object')
    expect(nodeJSON.compilerOptions.types).toStrictEqual([
      'node',
      'vitest/importMeta',
    ])
  })
})
