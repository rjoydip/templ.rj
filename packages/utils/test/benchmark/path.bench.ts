import { bench, describe } from 'vitest'
import { getRootDirAsync, getRootDirSync } from '../../src'

describe('path', () => {
  bench.only('root dir async', async () => {
    await getRootDirAsync()
  })

  bench.only('root dir sync', () => {
    getRootDirSync()
  })
})
