import { cwd, env } from 'node:process'
import { dirname, resolve } from 'node:path'
import { colors } from 'consola/utils'
import type { PluginBuild } from 'esbuild'
import { type Options as GlobbyOptions, globby } from 'globby'
import { copyHandler, verboseLog } from './utils'

export type MaybeArray<T> = T | T[]

export interface CopyOptions {
  /**
   * assets pair to copy
   *
   * @default []
   */
  patterns?: MaybeArray<string>
  /**
   *
   *
   * @default ''
   */
  toDir?: string

  /**
   * enable verbose logging
   *
   * outputs from-path and to-path finally passed to `fs.copyFileSync` method
   *
   * @default false
   */
  verbose?: boolean

  /**
   * options passed to `globby` when we 're globbing for files to copy
   *
   * @default {}
   */
  globbyOptions?: GlobbyOptions

  /**
   * only execute copy operation once
   *
   * useful when you're using ESBuild.build watching mode
   *
   * @default false
   */
  once?: boolean

  /**
   * base path used to resolve relative `assets.to` path
   * by default this plugin use `outdir` or `outfile` in your ESBuild options
   * you can specify "cwd" or process.cwd() to resolve from current working directory,
   * also, you can specify somewhere else to resolve from.
   *
   * @default "out"
   */
  resolveFrom?: 'cwd' | 'out' | (string & object)

  /**
   * use dry run mode to see what's happening.
   *
   * by default, enable this option means enable `verbose` option in the same time
   *
   * @default false
   */
  dryRun?: boolean
}

export function copy(options: CopyOptions) {
  return {
    name: 'CopyPlugin',
    async setup(build: PluginBuild) {
      const {
        patterns = [],
        toDir = '',
        dryRun = false,
        once = false,
        resolveFrom = 'out',
        globbyOptions = {},
        verbose: _verbose = false,
      } = options

      const verbose = dryRun === true || _verbose

      build.onEnd(async () => {
        const { PLUGIN_EXECUTED_FLAG } = env
        if (once && PLUGIN_EXECUTED_FLAG === 'true') {
          verboseLog({
            method: 'info',
            msg: `Copy plugin skipped as option ${colors.white('once')} set to true`,
            verbose,
          })
          return
        }

        if (!patterns.length)
          return null

        // the base destination dir that will resolve with asset.to value
        let outDirResolveFrom: string

        // resolve from cwd
        if (resolveFrom === 'cwd') {
          outDirResolveFrom = cwd()
          // resolve from outdir or outfile
        }
        else if (resolveFrom === 'out') {
          // outdir takes precedence over outfile because it should be used more widely
          const outDir = build.initialOptions.outdir
            // for outfile, use the directory it located in
            ?? dirname(build.initialOptions.outfile!)

          // This log should not be displayed as ESBuild will ensure one of options provided
          if (!outDir) {
            verboseLog({
              method: 'info',
              msg: colors.red(
                `You should provide valid ${colors.white(
                  'outdir',
                )} or ${colors.white(
                  'outfile',
                )} for assets copy. received outdir:${
                  build.initialOptions.outdir
                }, received outfile:${build.initialOptions.outfile}`,
              ),
              verbose,
            })

            return
          }

          outDirResolveFrom = outDir
        }
        else {
          // use custom resolveFrom dir
          outDirResolveFrom = resolveFrom
        }

        // the final value of outDirResolveFrom will be used by all asset pairs
        verboseLog({
          method: 'info',
          msg: `Resolve assert pair to path from: ${resolve(
            outDirResolveFrom,
          )}`,
          verbose,
        })

        const fromPaths = await globby(patterns, {
          // we don't expand directories be default
          expandDirectories: false,
          // ensure outputs contains only file path
          onlyFiles: true,
          ...globbyOptions,
        })

        if (!fromPaths.length) {
          verboseLog({
            method: 'info',
            msg: `No files matched using current glob pattern: ${colors.white(
                fromPaths.join(','),
              )}, maybe you need to configure globby by ${colors.white(
                'options.globbyOptions',
              )}?`,
            verbose,
          })
        }

        await copyHandler({
          fromPaths,
          toDir,
          verbose,
          dryRun,
        })

        return null
      })
    },
  }
}
