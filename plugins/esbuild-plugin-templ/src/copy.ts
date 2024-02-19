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
   * @default "cwd"
   */
  resolveFrom?: string

  /**
   * use dry run mode to see what's happening.
   *
   * by default, enable this option means enable `verbose` option in the same time
   *
   * @default false
   */
  dryRun?: boolean
  /**
   * use flat mode when not copying directories.
   *
   * by default, enable this option means enable `flat` option in the same time
   *
   * @default false
   */
  flat?: boolean
}

export function copy(options: CopyOptions) {
  return {
    name: 'CopyPlugin',
    async setup(build: PluginBuild) {
      const {
        patterns = [],
        dryRun = false,
        flat = false,
        once = false,
        globbyOptions = {},
        verbose: _verbose = false,
      } = options

      let {
        toDir = '',
        resolveFrom = 'cwd',
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

        toDir = !toDir ? (build.initialOptions.outdir ?? dirname(build.initialOptions.outfile!)) : toDir

        verboseLog({
          method: 'info',
          msg: `Resolved toDir to ${colors.white(toDir)}`,
          verbose,
        })

        resolveFrom = resolveFrom === 'cwd' ? resolve(cwd()) : resolve(cwd(), resolveFrom)

        const fromPaths = await globby(patterns, {
          expandDirectories: false,
          onlyFiles: true,
          absolute: true,
          cwd: resolveFrom,
          ...globbyOptions,
        })

        if (!fromPaths.length) {
          verboseLog({
            method: 'box',
            msg: `No files matched using current glob pattern: ${colors.white(
                fromPaths.join(','),
              )}, maybe you need to configure globby by ${colors.white(
                'options.globbyOptions',
              )}?`,
            verbose,
          })
        }

        await copyHandler({
          dryRun,
          flat,
          fromPaths,
          toDir,
          verbose,
        })

        return null
      })
    },
  }
}
