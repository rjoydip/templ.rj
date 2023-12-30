import { spec } from 'pactum'
import { describe, it } from 'vitest'

describe('hTTP', () => {
  it('should be a teapot', async () => {
    await spec()
      .get('http://httpbin.org/status/418')
      .expectStatus(418)
  })

  it('should get 201 error to save a new user', async () => {
    await spec()
      .post('https://jsonplaceholder.typicode.com/users')
      .withHeaders('Authorization', 'Basic xxxx')
      .withJson({
        name: 'bolt',
        email: 'bolt@swift.run',
      })
      .expectStatus(201)
  })
})
