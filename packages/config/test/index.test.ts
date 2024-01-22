import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getBuildConfig } from '../src'

const fixture = (folder: string) => resolve(__dirname, 'fixtures', folder)

describe('@templ/config', () => {
  it('should be validate build data', async () => {
    expect(await getBuildConfig(fixture('1'))).toStrictEqual({})
  })
})
