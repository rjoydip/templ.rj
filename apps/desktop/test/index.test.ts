import { describe, expect, it } from 'vitest'
import { title } from '../src'

describe('@templ/desktop', () => {
  it('title', () => {
    expect(title).toBe('desktop')
  })
})
