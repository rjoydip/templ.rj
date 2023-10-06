/// <reference path="../global.d.ts" />
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    example: string
  }
}

export default async function (fastify: FastifyInstance, _: FastifyPluginOptions) {
  fastify.get('/example', async () => {
    return { hello: fastify.example }
  })
}
