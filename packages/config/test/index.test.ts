import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { getBuildConfig, tsupDefaultConfig } from '../src'

const fixture = (folder: string) => join(join(__dirname, 'fixtures'), folder)

describe('@templ/config', () => {
  test('should be exported config modules', () => {
    expect(tsupDefaultConfig).toBeDefined()
  })

  test('should be validate build data', async () => {
    expect(await getBuildConfig(fixture('1'))).toStrictEqual({
      compile: 'esbuild',
    })
  })

  test('should return default build data', async () => {
    expect(await getBuildConfig()).toStrictEqual({
      assets: [],
      exclude: [],
      include: [],
      clean: true,
      dts: true,
      minify: true,
      compile: 'esbuild',
      format: ['esm'],
    })
  })
})
