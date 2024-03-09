import type { BuildOptions, Plugin } from 'esbuild'
import type { UserConfig } from 'vitest'
import { mergeConfig } from 'vitest/config'
import { clean, dts } from './plugins'

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
export function getVitestConfig(opts: UserConfig = {}) {
  const exclude = ['**/*esbuild.config.ts', '**/coverage/**', '**/dist/**', '**/.config/**', '**/scripts/**', '**/.storybook/**', 'esbuild.config.ts', '**/*.stories.{js,ts,jsx,tsx}']
  return mergeConfig(
    {
      test: {
        include: ['{test,tests}/**/*.test.{ts,js}'],
        exclude,
        coverage: {
          exclude,
        },
      },
    },
    opts,
  )
}
