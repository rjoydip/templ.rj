import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { getBuildConfig } from '../src'

const fixture = (folder: string) => join(join(__dirname, 'fixtures'), folder)

describe('@templ/config', () => {
  test('should be validate build data', async () => {
    expect(await getBuildConfig(fixture('1'))).toStrictEqual({})
  })
})
