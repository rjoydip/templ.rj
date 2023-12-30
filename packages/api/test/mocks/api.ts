import { mock } from 'pactum'

mock.addInteraction({
  request: {
    method: 'GET',
    path: '/api/hello',
  },
  response: {
    status: 200,
    body: 'Hello, 👋',
  },
})

const mockApi = mock

export default mockApi
