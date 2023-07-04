import { beforeAll, describe, expect, test } from 'vitest'
import pkgInfo from '../../src/utils/pkg-info'

describe('pkg info', async () => {
  let pkg: {
    name: string
    version: string
    path: string
  } = {
    name: '',
    version: '',
    path: '',
  }

  beforeAll(async () => {
    pkg = await pkgInfo()
  })

  test('name', () => {
    expect(pkg.name).toStrictEqual('GRFT')
  })
  test('version', () => {
    expect(pkg.version).toStrictEqual('0.1.0')
  })
  test('path', () => {
    expect(pkg.path).toBeDefined()
  })
})
