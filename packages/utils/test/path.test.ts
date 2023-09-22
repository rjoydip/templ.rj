import { describe, expect, test } from 'vitest'
import { pkgRoot, root } from '../src'

describe('@templ/utils > path', () => {
  test('should be validate root path', () => {
    expect(root).toContain('templ')
  })
  test('should be validate package path', () => {
    expect(pkgRoot).toContain('package')
  })
})
