import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'

const app = new OpenAPIHono()

app.get('/', (c) => {
  return c.text('🔥 Templ')
})

app.openapi(
  createRoute({
    method: 'get',
    path: '/hello',
    description: 'Respond a message',
    tags: [],
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
    },
  }),
  (c) => {
    return c.json({
      message: 'Hello, 👋',
    })
  },
)

app.doc('/swagger.json', {
  info: {
    title: 'Templ',
    description: 'Templ OpenAPI specification.',
    version: 'v0',
  },
  openapi: '3.1.0',
})

app.get(
  '/reference',
  apiReference({
    theme: 'purple',
    pageTitle: 'Templ API Reference',
    spec: {
      url: '/swagger.json',
    },
  }),
)

export default app
