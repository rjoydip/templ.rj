import { describe, expect, it } from 'vitest'
import app from '../src/app'

describe('api', () => {
  it('should be valid GET /hello', async () => {
    const res = await app.request('/hello')
    expect(res.status).toBe(200)
    expect(await res.json()).toStrictEqual({
      message: 'Hello, 👋',
    })
  })
})
