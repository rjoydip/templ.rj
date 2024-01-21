import { spec } from 'pactum'
import { afterAll, beforeAll, describe, it } from 'vitest'
import mockApi from './mocks/api'

describe('api', () => {
  beforeAll(() => {
    mockApi.start(3000)
  })

  afterAll(() => {
    mockApi.stop()
  })

  it('should get 200 for endpoint api/hello', async () => {
    await spec()
      .get('http://localhost:3000/api/hello')
      .expectStatus(200)
      .expectBody('Hello, 👋')
  })
})
