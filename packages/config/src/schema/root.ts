import { normalize } from 'node:path'
import { cwd } from 'node:process'
import consola from 'consola'
import { findWorkspaceDir } from 'pkg-types'
import { defineUntypedSchema } from 'untyped'
import { isTest } from 'std-env'

export default defineUntypedSchema({
  /**
   * Define the root directory of your application.
   *
   * This property can be overwritten (for example, running `nuxt ./my-app/`
   * will set the `rootDir` to the absolute path of `./my-app/` from the
   * current/working directory.
   *
   * It is normally not needed to configure this option.
   */
  ROOT_DIR: {
    $resolve: async (val) => { return normalize(typeof val === 'string' ? await findWorkspaceDir(val) : await findWorkspaceDir(cwd())) },
  },

  /**
   * Define the workspace directory of your application.
   *
   * Often this is used when in a monorepo setup. Nuxt will attempt to detect
   * your workspace directory automatically, but you can override it here.
   *
   * It is normally not needed to configure this option.
   */
  WORKSPACE_DIR: {
    $default: cwd(),
    $resolve: val => val,
  },
  /**
   * The builder to use for bundling the your application.
   * @type {'esbuild' | 'unbuild' | 'vite' | 'rollup' }
   * @default 'esbuild'
   */
  PACKAGE_BUILDER: {
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
  },
  /**
   * Log level when building logs.
   *
   * Defaults to 'silent' when running in CI or when a TTY is not available.
   * This option is then used as 'silent' in Vite
   * @type {'silent' | 'info' | 'verbose'}
   */
  LOG_LEVEL: {
    $default: 'silent',
    $resolve: (val: string) => {
      if (val && !['silent', 'info', 'verbose', 'error', 'warn', 'success'].includes(val.toString()))
        consola.warn(`Invalid \`LOG_LEVEL\` option: \`${val}\`. Must be one of: \`silent\`, \`info\`, \`verbose\`.`)

      return val ?? (isTest ? 'silent' : 'info')
    },
  },
})
