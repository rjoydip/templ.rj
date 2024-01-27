import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { findWorkspaceDir } from 'pkg-types'
import { defineUntypedSchema } from 'untyped'

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
  rootDir: {
    $resolve: val => typeof val === 'string' ? resolve(val) : cwd(),
  },

  /**
   * Define the workspace directory of your application.
   *
   * Often this is used when in a monorepo setup. Nuxt will attempt to detect
   * your workspace directory automatically, but you can override it here.
   *
   * It is normally not needed to configure this option.
   */
  workspaceDir: {
    $default: cwd(),
    $resolve: async (val, get) => {
      const rootDir = ((await get('rootDir')) || cwd()) as string
      return val ? resolve(rootDir.toString(), val.toString()) : await findWorkspaceDir(rootDir).catch(() => rootDir)
    },
  },
})
