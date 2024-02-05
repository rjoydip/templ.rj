import { env } from 'node:process'
import { defineUntypedSchema } from 'untyped'

const { PORT = 3000, HOST = 'localhost' } = env

export default defineUntypedSchema({
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
  HTTPS: false,
  /**
   * Listening dev server URL.
   * @default `http://${HOST}:${PORT}`
   * @example
   * ```bash
   * HOST=localhost PORT=3000 node .output/server/index.mjs
   * ```
   * @description
   * This should not be set directly as it will always be overridden by the
   * dev server with the full URL (for module and internal use).
   */
  URL: {
    $default: `http://${HOST}:${PORT}`,
    $resolve: async (val, get) => val || `${await get('HTTPS') ? 'http' : 'http'}://${await get('HOST')}:${await get('PORT')}`,
  },
  /**
   * The base path of your Nuxt application.
   * @default './db.sqlite'
   * @example
   * ```bash
   * DATABASE_URL=./db.sqlite APP_BASE_URL=/prefix/ node .output/server/index.mjs
   * ```
   * @description
   * This can be set at runtime by setting the APP_BASE_URL environment variable.
   * @see https://sqlite.org
   */
  DATABASE_URL: {
    $default: './db.sqlite',
    $resolve: val => val || './db.sqlite',
  },
  /**
   * The environment mode of your application.
   * @type {'development' | 'production' | 'testing'}
   * @default 'production'
   * @example
   * ```bash
   * NODE_ENV=development node .output/server/index.mjs
   * ```
   * @description
   * This is used to set the `NODE_ENV` environment variable.
   * @see https://nodejs.org/api/process.html#process_process_env
   */
  NODE_ENV: {
    $default: 'production',
    $resolve: val => val || 'production',
  },
  /**
   * The port of your application.
   * @default '3000'
   * @example
   * ```bash
   * PORT=3000 node .output/server/index.mjs
   * ```
   * @description
   * This is used to set the `PORT` environment variable.
   * @see https://nodejs.org/api/process.html#process_process_env
   */
  PORT: {
    $default: 3000,
    $resolve: val => val || PORT,
  },
  /**
   * The API key of your OpenAI account.
   * @default ''
   * @example
   * ```bash
   * OPEN_AI_API_KEY=... node .output/server/index.mjs
   * ```
   * @description
   * This is used to set the `OPEN_AI_API_KEY` environment variable.
   * @see https://platform.openai.com/account/api-keys
   */
  OPEN_AI_API_KEY: {
    $default: '',
    $resolve: val => val || '',
  },
})
