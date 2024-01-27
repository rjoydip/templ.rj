import consola from 'consola'
import { isTest } from 'std-env'
import { defineUntypedSchema } from 'untyped'

export default defineUntypedSchema({
  /**
   * The builder to use for bundling the Vue part of your application.
   * @type {'tsup' | 'unbuild'}
   */
  builder: {
    $default: 'tsup',
    $resolve: async (val, get) => {
      if (!val)
        return null

      if (typeof val === 'object')
        return val

      const map = {
        tsup: 'tsup',
        unbuild: 'unbuild',
      }
      return val || (await get('tsup') === false ? map.unbuild : map.tsup)
    },
  },
  /**
   * Log level when building logs.
   *
   * Defaults to 'silent' when running in CI or when a TTY is not available.
   * This option is then used as 'silent' in Vite and 'none' in Webpack
   * @type {'silent' | 'info' | 'verbose'}
   */
  logLevel: {
    $default: 'silent',
    $resolve: (val) => {
      if (typeof val === 'object')
        return val

      if (val && !['silent', 'info', 'verbose'].includes(val.toString()))
        consola.warn(`Invalid \`logLevel\` option: \`${val}\`. Must be one of: \`silent\`, \`info\`, \`verbose\`.`)

      return val ?? (isTest ? 'silent' : 'info')
    },
  },
})
