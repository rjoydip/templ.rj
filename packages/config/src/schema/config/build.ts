import consola from 'consola'
import { isTest } from 'std-env'
import { defineUntypedSchema } from 'untyped'

export default defineUntypedSchema({
  /**
   * The builder to use for bundling the your application.
   * @type {'esbuild' | 'unbuild' | 'vite' }
   */
  builder: {
    $default: 'vite',
    $resolve: async (val: string) => {
      if (typeof val === 'object')
        return val

      const map: {
        [x: string]: string
      } = {
        esbuild: 'esbuild',
        unbuild: 'unbuild',
        vite: 'vite',
      }
      return val || map[val.toString()]
    },
  },
  /**
   * Log level when building logs.
   *
   * Defaults to 'silent' when running in CI or when a TTY is not available.
   * This option is then used as 'silent' in Vite
   * @type {'silent' | 'info' | 'verbose'}
   */
  logLevel: {
    $default: 'silent',
    $resolve: (val: string) => {
      if (typeof val === 'object')
        return val

      if (val && !['silent', 'info', 'verbose'].includes(val.toString()))
        consola.warn(`Invalid \`logLevel\` option: \`${val}\`. Must be one of: \`silent\`, \`info\`, \`verbose\`.`)

      return val ?? (isTest ? 'silent' : 'info')
    },
  },
})
