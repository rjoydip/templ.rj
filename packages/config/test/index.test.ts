import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { getBuildConfig } from '../src'

const fixture = (folder: string) => join(join(__dirname, 'fixtures'), folder)

describe('@templ/config', () => {
  test('should be validate build data', async () => {
    expect(await getBuildConfig(fixture('1'))).toStrictEqual({
      bundler: 'esbuild',
    })
  })

  test('should return default build data', async () => {
    expect(await getBuildConfig()).toStrictEqual({
      assets: [],
      bundle: false,
      bundler: 'esbuild',
      clean: true,
      debug: false,
      dts: true,
      exclude: [],
      format: [],
      include: [],
      minify: true,
      outDir: '',
      outFile: '',
      srcDir: '',
      target: '',
      tsconfig: '',
      watch: false,
    })
  })
})
