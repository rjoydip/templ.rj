import { describe, it } from 'vitest'
import { getRootDirAsync, getRootDirSync } from '../../src'

describe('path', () => {
  it('root dir async', async () => {
    await getRootDirAsync()
  })

  it('root dir sync', () => {
    getRootDirSync()
  })
})
