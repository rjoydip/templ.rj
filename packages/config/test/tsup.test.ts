import { describe, expect, test } from 'vitest'
import type { Options } from 'tsup'
import { tsupConfig } from '../src'

describe('@templ/config > tsup', () => {
  const config = tsupConfig as Options
  test('should return default configuration', () => {
    expect(config).toBeDefined()
  })
  test('should validate all props type and values', () => {
    expect(config).toBeDefined()
    // entry
    expect(typeof config.entry).toBe('object')
    expect(config.entry).toStrictEqual(['./src/index.ts'])
    // splitting
    expect(typeof config.splitting).toBe('boolean')
    expect(config.splitting).toBeFalsy()
    // sourcemap
    expect(typeof config.sourcemap).toBe('boolean')
    expect(config.sourcemap).toBeFalsy()
    // clean
    expect(typeof config.clean).toBe('boolean')
    expect(config.clean).toBeTruthy()
    // dts
    expect(typeof config.dts).toBe('boolean')
    expect(config.dts).toBeTruthy()
    // target
    expect(typeof config.target).toBe('string')
    expect(config.target).toBe('esnext')
    // format
    expect(typeof config.format).toBe('object')
    expect(config.format).toStrictEqual(['esm'])
    // platform
    expect(typeof config.platform).toBe('string')
    expect(config.platform).toBe('node')
  })

  test('should validate all object entries', () => {
    expect(Object.entries(config).map((i) => i[0])).toStrictEqual([
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
