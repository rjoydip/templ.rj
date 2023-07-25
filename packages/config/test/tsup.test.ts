import { describe, expect, test } from 'vitest'
import { defaultConfig, tsupConfig } from '../src/tsup'

describe('@gfft/config > tsup', () => {
  test('should return default configuration', () => {
    expect(tsupConfig()).toEqual(defaultConfig)
  })
  test('should validate all props type and values', () => {
    expect(defaultConfig).toBeDefined()
    // entry
    expect(typeof defaultConfig.entry).toBe('object')
    expect(defaultConfig.entry).toStrictEqual(['src/index.ts'])
    // splitting
    expect(typeof defaultConfig.splitting).toBe('boolean')
    expect(defaultConfig.splitting).toBeFalsy()
    // sourcemap
    expect(typeof defaultConfig.sourcemap).toBe('boolean')
    expect(defaultConfig.sourcemap).toBeFalsy()
    // clean
    expect(typeof defaultConfig.clean).toBe('boolean')
    expect(defaultConfig.clean).toBeTruthy()
    // dts
    expect(typeof defaultConfig.dts).toBe('boolean')
    expect(defaultConfig.dts).toBeTruthy()
    // target
    expect(typeof defaultConfig.target).toBe('string')
    expect(defaultConfig.target).toBe('esnext')
    // format
    expect(typeof defaultConfig.format).toBe('object')
    expect(defaultConfig.format).toStrictEqual(['esm'])
    // platform
    expect(typeof defaultConfig.platform).toBe('string')
    expect(defaultConfig.platform).toBe('node')
  })

  test('should validate all object entries', () => {
    expect(Object.entries(defaultConfig).map((i) => i[0])).toStrictEqual([
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

  test('should return default configuration with different entrypoint', () => {
    expect(
      tsupConfig(
        {
          entryPoints: ['src/index.ts'],
        },
        {
          arrayMerge: 'overwrite',
        },
      ),
    ).toEqual({ ...defaultConfig, entryPoints: ['src/index.ts'] })
  })
})
