import { describe, expect, it } from 'vitest'
import { getTemplConfigTypes } from '../src'

describe('@templ/config > types', () => {
  it('should match type of getTemplConfigTypes', async () => {
    const types = await getTemplConfigTypes()
    expect(types).toBeDefined()
  })
})
