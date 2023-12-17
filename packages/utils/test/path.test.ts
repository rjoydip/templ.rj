import { describe, expect, it } from 'vitest'
import { appsRoot, pkgRoot, root, scriptsRoot, thirdPartyRoot } from '../src'

describe('@templ/utils > path', () => {
  it('should be validate root path', () => {
    expect(root).toContain('templ')
  })
  it('should be validate package path', () => {
    expect(pkgRoot).toContain('package')
  })
  it('should be validate apps path', () => {
    expect(appsRoot).toContain('apps')
  })
  it('should be validate scripts path', () => {
    expect(scriptsRoot).toContain('scripts')
  })
  it('should be validate third party path', () => {
    expect(thirdPartyRoot).toContain('third_party')
  })
})
