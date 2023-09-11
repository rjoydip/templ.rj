import { resolve } from 'node:path'
import type { Plugin } from 'esbuild'
import { getTsconfig } from 'get-tsconfig'
import ts from 'typescript'
import { PrettyError } from '@templ/utils'
import { DTSPluginSchema } from '../schema'
import type { DTSPlugin } from '../schema'

export const dTSPlugin = (pluginOptions: DTSPlugin = {
  tsconfig: 'tsconfig.json',
  outDir: 'dist',
  debug: false
}): Plugin => {
  return {
    name: 'esbuild-plugin-dts',
    async setup(build) {
      const options = await DTSPluginSchema.parseAsync(pluginOptions)
      const { entryPoints, outdir, tsconfig } = build.initialOptions

      const tsconfigData = getTsconfig(resolve(tsconfig ?? options.tsconfig ?? './'))

      const program = ts.createProgram(entryPoints as string[], {
        declaration: tsconfigData.config.compilerOptions.declaration || true,
        emitDeclarationOnly: tsconfigData.config.compilerOptions.emitDeclarationOnly || true,
        declarationDir: tsconfigData.config.compilerOptions.declarationDir || outdir
      })
      const res = program.emit()

      // In case there was some error while generating declaration,
      // throw an error.
      res.diagnostics.forEach(({ messageText }) => {
        throw new PrettyError(messageText.toString())
      })
    }
  }
}
