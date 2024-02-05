import { defineUntypedSchema } from 'untyped'

export default defineUntypedSchema({
  /**
   * The base path of your application.
   *
   * This can be set at runtime by setting the APP_BASE_URL environment variable.
   * @example
   * ```bash
   * APP_BASE_URL=/prefix/ node .output/app/index.mjs
   * ```
   */
  APP_BASE_URL: {
    $default: '/',
    $resolve: val => val,
  },
  /**
   * The builder to use for bundling the your application.
   * @type { 'vite' | 'webpack' | 'rollup' }
   * @default 'esbuild'
   */
  FRONTEND_BUILDER: {
    $default: 'vite',
    $resolve: async (val: string) => {
      const map: {
        [x: string]: string
      } = {
        webpack: 'webpack',
        vite: 'vite',
        rollup: 'rollup',
      }
      return val || map[val.toString()]
    },
  },
})
