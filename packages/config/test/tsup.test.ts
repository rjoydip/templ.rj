import { describe, expect, test } from 'vitest'
import { tsupDefaultConfig } from '../src'

describe('@templ/config > tsup', () => {
  test('should validate all props type and values', () => {
    expect(tsupDefaultConfig).toBeDefined()
    // entry
    expect(typeof tsupDefaultConfig.entry).toBe('object')
    expect(tsupDefaultConfig.entry).toStrictEqual(['src/index.ts'])
    // splitting
    expect(typeof tsupDefaultConfig.splitting).toBe('boolean')
    expect(tsupDefaultConfig.splitting).toBeFalsy()
    // sourcemap
    expect(typeof tsupDefaultConfig.sourcemap).toBe('boolean')
    expect(tsupDefaultConfig.sourcemap).toBeFalsy()
    // clean
    expect(typeof tsupDefaultConfig.clean).toBe('boolean')
    expect(tsupDefaultConfig.clean).toBeTruthy()
    // dts
    expect(typeof tsupDefaultConfig.dts).toBe('boolean')
    expect(tsupDefaultConfig.dts).toBeTruthy()
    // target
    expect(typeof tsupDefaultConfig.target).toBe('string')
    expect(tsupDefaultConfig.target).toBe('esnext')
    // format
    expect(typeof tsupDefaultConfig.format).toBe('object')
    expect(tsupDefaultConfig.format).toStrictEqual(['esm'])
    // platform
    expect(typeof tsupDefaultConfig.platform).toBe('string')
    expect(tsupDefaultConfig.platform).toBe('node')
  })

  test('should validate all object entries', () => {
    expect(Object.entries(tsupDefaultConfig).map(i => i[0])).toStrictEqual([
      'entry',
      'splitting',
      'sourcemap',
      'clean',
      'dts',
      'minify',
      'target',
      'format',
      'platform',
    ])
  })
})
