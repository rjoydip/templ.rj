import { env } from 'node:process'
import { defineUntypedSchema } from 'untyped'

const { PORT, TEMPL_PORT, HOST, TEMPL_HOST } = env

export default defineUntypedSchema({
  devServer: {
    /**
     * Whether to enable HTTPS.
     * @example
     * ```
     * export default defineTemplConfig({
     *   devServer: {
     *     https: {
     *       key: './server.key',
     *       cert: './server.crt'
     *     }
     *   }
     * })
     * ```
     * @type {boolean | { key: string; cert: string }}
     */
    https: false,

    /** Dev server listening port */
    port: TEMPL_PORT || PORT || 3000,

    /** Dev server listening host */
    host: TEMPL_HOST || HOST || 'localhost',
    /**
     * Listening dev server URL.
     *
     * This should not be set directly as it will always be overridden by the
     * dev server with the full URL (for module and internal use).
     */
    url: 'http://localhost:3000',
  },
})
