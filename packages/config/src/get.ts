import type { BuildOptions, Plugin } from 'esbuild'
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
 * ```
 * @see https://esbuild.github.io/api/#BuildOptions
 * @see https://esbuild.github.io/api/#watch
 * @see https://esbuild.github.io/api/#build
 *
 * @return {BuildOptions} the build configuration options
 */
export function getBuildConfig({
  plugins = [],
}: {
  plugins?: Plugin[]
}): BuildOptions {
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
    plugins: [clean(), dts(), ...plugins],
  }
}

/**
 * Retrieves the Vitest configuration settings.
 *
 * @example
 * ```ts
 * import { getVitestConfig } from '@templ/config'
 * const vitestConfig = getVitestConfig()
 * ```
 * @see https://vitest.dev/config
 * @see https://vitest.dev/api
 * @see https://github.com/vitest-dev/vitest
 *
 * @return {object} The Vitest configuration object.
 */
export function getVitestConfig() {
  return {
    test: {
      include: ['{test,tests}/**/*.test.{ts,js}'],
      coverage: {
        enabled: true,
        reporter: ['text', 'json', 'html'],
      },
    },
  }
}
