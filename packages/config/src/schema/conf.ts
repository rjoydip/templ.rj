import { z } from 'zod'
import { sharedSchema } from './shared'

export const configSchema = {
  client: {
    /**
     * The base path of your application.
     *
     * This can be set at runtime by setting the APP_BASE_URL environment variable.
     * @example
     * ```bash
     * APP_BASE_URL=/prefix/ node .output/app/index.mjs
     * ```
     */
    BASE_URL: z.string().optional().default('/'),
    /**
     * The builder to use for bundling the your application.
     * @type { 'vite' | 'webpack' | 'rollup' }
     * @default 'esbuild'
     */
    BUILDER: z.string().optional().default('vite'),
    /* APP_BUILDER: {
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
  }, */
    PUBLIC_URL: z.string().url(),
  },
  package: {
    /**
     * The builder to use for bundling the your application.
     * @type { 'esbuild' | 'unbuild' | 'vite' | 'rollup' }
     * @default 'esbuild'
     *
     * @see https://esbuild.github.io
     * @see https://unbuild.dev
     * @see https://vitejs.dev
     */
    BUILDER: z.string().optional().default('esbuild'),
  /* PACKAGE_BUILDER: {
    $default: 'esbuild',
    $resolve: async (val: string) => {
      const map: {
        [x: string]: string
      } = {
        esbuild: 'esbuild',
        unbuild: 'unbuild',
        vite: 'vite',
        rollup: 'rollup',
      }
      return val || map[val.toString()]
    },
  }, */
  },
  server: {},
  shared: sharedSchema,
}
