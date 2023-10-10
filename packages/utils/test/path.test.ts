import { describe, expect, it } from 'vitest'
import { pkgRoot, root } from '../src'

describe('@templ/utils > path', () => {
  it('should be validate root path', () => {
    expect(root).toContain('templ')
  })
  it('should be validate package path', () => {
    expect(pkgRoot).toContain('package')
  })
})
