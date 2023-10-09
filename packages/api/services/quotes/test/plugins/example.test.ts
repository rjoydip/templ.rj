import assert from 'node:assert'
import test from 'node:test'
import { getServer } from '../helper'

test('example decorator', async () => {
  const server = await getServer()
  assert.strictEqual(server.example, 'foobar')
  server.close()
})
