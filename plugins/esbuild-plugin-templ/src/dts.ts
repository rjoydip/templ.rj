import { cwd } from 'node:process'
import { parse, resolve } from 'node:path'
import type { PartialMessage, PluginBuild } from 'esbuild'
import ts from 'typescript'
import consola from 'consola'
import { colors } from 'consola/utils'

export interface DTSOptions {
  outDir: string
  outFile: string
  tsConfig?: string
  cwd: string
}

export function dts(opts: DTSOptions = {
  outDir: 'dist',
  outFile: 'dist/index.js',
  cwd: cwd(),
}) {
  return {
    name: 'DTSPlugin',
    async setup(build: PluginBuild) {
      const inputFiles: string[] = []
      const compilerOptions = ts.parseJsonConfigFileContent(
        ts.readConfigFile(opts.tsConfig ? resolve(opts.tsConfig) : resolve(cwd(), 'tsconfig.json'), ts.sys.readFile).config,
        {
          fileExists: ts.sys.fileExists,
          readFile: ts.sys.readFile,
          readDirectory: ts.sys.readDirectory,
          useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
        },
        opts.cwd,
      ).options

      compilerOptions.declaration = true
      compilerOptions.emitDeclarationOnly = true

      if (!compilerOptions.declarationDir)
        compilerOptions.declarationDir = build.initialOptions.outdir ?? compilerOptions.outDir ?? parse(resolve(build.initialOptions.outfile ?? opts.outFile)).dir

      const compilerHost = compilerOptions.incremental
        ? ts.createIncrementalCompilerHost(compilerOptions)
        : ts.createCompilerHost(compilerOptions)

      build.onLoad({ filter: /(\.tsx|\.ts)$/ }, (args) => {
        inputFiles.push(args.path)
        const errors: PartialMessage[] = []

        compilerHost.getSourceFile(
          args.path,
          compilerOptions.target ?? ts.ScriptTarget.Latest,
          (m) => {
            errors.push({
              detail: m,
            })
          },
          true,
        )

        return {
          errors,
        }
      })

      build.onEnd(() => {
        let compilerProgram

        const startTime = Date.now()

        if (compilerOptions.incremental) {
          compilerProgram = ts.createIncrementalProgram({
            options: compilerOptions,
            host: compilerHost,
            rootNames: inputFiles,
          })
        }
        else {
          compilerProgram = ts.createProgram(
            inputFiles,
            compilerOptions,
            compilerHost,
          )
        }

        const diagnostics = ts
          .getPreEmitDiagnostics(compilerProgram as ts.Program)
          .map(
            d =>
                ({
                  text:
                        typeof d.messageText === 'string'
                          ? d.messageText
                          : d.messageText.messageText,
                  detail: d,
                  location: {
                    file: d.file?.fileName,
                    namespace: 'file',
                  },
                  category: d.category,
                }) satisfies PartialMessage & {
                  category: ts.DiagnosticCategory
                },
          )

        const errors = diagnostics
          .filter(d => d.category === ts.DiagnosticCategory.Error)
          .map(({ category: _, ...message }) => {
            consola.error(message)
            return message
          })

        const warnings = diagnostics
          .filter(d => d.category === ts.DiagnosticCategory.Warning)
          .map(({ category: _, ...message }) => {
            consola.warn(message)
            return message
          })

        if (errors.length > 0 && warnings.length > 0) {
          return {
            errors,
            warnings,
          }
        }

        if (errors.length > 0 && warnings.length === 0) {
          return {
            errors,
          }
        }

        compilerProgram.emit()

        consola.info(
          colors.green(`Finished compiling declarations in ${
              Date.now() - startTime
          }ms`),
        )

        return {
          warnings,
        }
      })
    },
  }
}
