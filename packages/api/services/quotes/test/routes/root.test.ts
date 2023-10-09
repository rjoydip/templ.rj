import assert from 'node:assert'
import test from 'node:test'
import { getServer } from '../helper'

test('root', async () => {
  const server = await getServer()
  const res = await server.inject({
    method: 'GET',
    url: '/example',
  })

  assert.strictEqual(res.statusCode, 200)
  assert.deepStrictEqual(res.json(), {
    hello: 'foobar',
  })
  server.close()
})
