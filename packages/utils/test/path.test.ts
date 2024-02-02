import { describe, expect, it } from 'vitest'
import { getAppsDirAsync, getAppsDirSync, getPackagesDirAsync, getPackagesDirSync, getRootDirAsync, getRootDirSync } from '../src'

describe('@templ/utils > path', () => {
  it('should be validate root path', async () => {
    const rootAsync = await getRootDirAsync()
    expect(getRootDirSync()).toContain('templ')
    expect(rootAsync).toContain('templ')
  })
  it('should be validate packages path', async () => {
    const pkgAsync = await getPackagesDirAsync()
    expect(getPackagesDirSync()).toContain('packages')
    expect(pkgAsync).toContain('packages')
  })
  it('should be validate apps path', async () => {
    const appsAsync = await getAppsDirAsync()
    expect(getAppsDirSync()).toContain('apps')
    expect(appsAsync).toContain('apps')
  })
})
