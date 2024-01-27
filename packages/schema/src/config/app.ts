import { defineUntypedSchema } from 'untyped'

export default defineUntypedSchema({
  app: {
    /**
     * The base path of your Nuxt application.
     *
     * This can be set at runtime by setting the APP_BASE_URL environment variable.
     * @example
     * ```bash
     * APP_BASE_URL=/prefix/ node .output/server/index.mjs
     * ```
     */
    baseURL: {
      $resolve: val => val || '/',
    },
  },
})
