import { cwd } from 'node:process'
import { findWorkspaceDir } from 'pkg-types'
import { z } from 'zod'

export const sharedSchema = {
  DIR: z.string().optional().default(await findWorkspaceDir(cwd())),

  /**
   * Define the workspace directory of your application.
   *
   * Often this is used when in a monorepo setup. Nuxt will attempt to detect
   * your workspace directory automatically, but you can override it here.
   *
   * It is normally not needed to configure this option.
   */
  WORKSPACE_DIR: z.string().optional().default(cwd()),
  /**
   * Log level when building logs.
   *
   * Defaults to 'silent' when running in CI or when a TTY is not available.
   * This option is then used as 'silent' in Vite
   * @type {'silent' | 'info' | 'verbose'}
   */
  LOG_LEVEL: z.string().optional().default('silent'),
  /* LOG_LEVEL: {
      $default: 'silent',
      $resolve: (val: string) => {
        if (val && !['silent', 'info', 'verbose', 'error', 'warn', 'success'].includes(val.toString()))
          consola.warn(`Invalid \`LOG_LEVEL\` option: \`${val}\`. Must be one of: \`silent\`, \`info\`, \`verbose\`.`)

        return val ?? (isTest ? 'silent' : 'info')
      },
    }, */
}
