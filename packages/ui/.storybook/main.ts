import { resolve } from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import * as pkg from '../package.json'

const config: StorybookConfig = {
  core: {
    builder: '@storybook/builder-vite',
    // we don't want to muck up the data when we're working on the builder
    disableTelemetry: true,
  },
  stories: ['../stories/**/*.mdx', '../registry/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@geometricpanda/storybook-addon-badges',
    '@storybook/addon-essentials',
    // '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    'storybook-dark-mode',
    'storybook-addon-performance',
    'storybook-addon-pseudo-states',
  ],
  framework: '@storybook/react-vite',
  async viteFinal(config) {
    return mergeConfig(config, {
      sourcemap: false,
      target: 'esnext',
      esbuild: {
        ignoreAnnotations: true,
        treeShaking: true,
      },
      optimizeDeps: {},
      build: {
        rollupOptions: {
          output: {
            // Since we publish our ./src folder, there's no point
            // in bloating sourcemaps with another copy of it.
            sourcemapExcludeSources: true,
          },
          external: ['next-themes', ...Object.keys(pkg.devDependencies)],
          /**
           * Ignore "use client" waning since we are not using SSR
           * @see {@link https://github.com/TanStack/query/pull/5161#issuecomment-1477389761 Preserve 'use client' directives TanStack/query#5161}
           * @see {@link https://github.com/rjoydip/templ/issues/270}
           */
          onwarn(warning, warn) {
            if (
              warning.code === 'MODULE_LEVEL_DIRECTIVE'
              && warning.message.includes(`"use client"`)
            )
              return

            warn(warning)
          },
        },
      },
      plugins: [
        tsconfigPaths(),
        {
          resolveId(code) {
            if (code === 'react')
              return resolve(require.resolve('react'))
          },
        },
      ],
    })
  },
}
export default config
