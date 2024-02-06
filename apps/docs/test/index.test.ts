import { describe, expect, it } from 'vitest'
import { title } from '../src'

describe('@templ/docs', () => {
  it('title', () => {
    expect(title).toBe('desktop')
  })
})
