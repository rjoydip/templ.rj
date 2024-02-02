import { rm } from 'node:fs/promises'
import { parse } from 'node:path'
import type { PluginBuild } from 'esbuild'

export function clean() {
  return {
    name: 'CleanPlugin',
    setup(build: PluginBuild) {
      build.onStart(async () => {
        if (build.initialOptions.outdir) {
          return await rm(build.initialOptions.outdir, {
            force: true,
            recursive: true,
          })
        }
        if (build.initialOptions.outfile) {
          return await rm(parse(build.initialOptions.outfile).dir, {
            force: true,
            recursive: true,
          })
        }
        return null
      })
    },
  }
}
