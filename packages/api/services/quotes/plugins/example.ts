/// <reference path="../global.d.ts" />
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function (fastify: FastifyInstance, _: FastifyPluginOptions) {
  fastify.decorate('example', 'foobar')
}
