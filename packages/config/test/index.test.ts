import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadTeamplConfig } from '../src'

const fixturePath = resolve(__dirname, 'fixtures')

describe('@templ/config', () => {
  it('should be validate build data', async () => {
    const pkgData = await loadTeamplConfig({
      cwd: fixturePath,
    })
    expect(pkgData).toBeDefined()
  })
})
