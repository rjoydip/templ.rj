import type { BuildOptions } from 'esbuild'
import { clean, dts } from '@templ/esbuild-plugin-templ'
import { TemplConfigSchema } from './schema'

/**
 * Retrieves the TemplConfigSchema.
 * @example
 * ```ts
 * import { getTemplConfigSchema } from '@templ/config'
 * const config = getTemplConfigSchema()
 * ```
 * @return {TemplConfigSchema} The retrieved TemplConfigSchema
 */
export function getTemplConfigSchema() {
  return TemplConfigSchema
}
/**
 * Retrieves the build configuration options.
 * @example
 * ```ts
 * import { getBuildConfig } from '@templ/config'
 * const buildConfig = getBuildConfig()
 * const ctx = await esbuild.build(buildConfig)
 * await ctx.watch()
 * await esbuild.build(buildConfig)
 * ```
 * @see https://esbuild.github.io/api/#BuildOptions
 * @see https://esbuild.github.io/api/#watch
 * @see https://esbuild.github.io/api/#build
 *
 * @return {BuildOptions} the build configuration options
 */
export function getBuildConfig(): BuildOptions {
  return {
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: false,
    treeShaking: true,
    target: ['node20'],
    packages: 'external',
    format: 'esm',
    outdir: 'dist',
    plugins: [clean(), dts()],
  }
}
/**
 * Retrieves the Vitest configuration.
 * @example
 * ```ts
 * import { getVitestConfig } from '@templ/config'
 * ```
 * @return {object} the Vitest configuration object
 */
export function getVitestConfig() {
  return {
    test: {
      include: ['test/**/*.test.ts'],
      coverage: {
        enabled: true,
        reporter: ['text', 'json', 'html'],
      },
    },
  }
}
