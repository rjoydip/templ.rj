import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    'packages/*': {
      entry: ['**/*.ts', '**/*.config.js', '!*.d.ts', 'tsup.config.ts'],
      ignore: ['**/fixtures'],
    },
    'packages/cli': {
      entry: ['**/*.ts', '!*.mjs'],
      ignore: ['*.mjs'],
    },
    'scripts': {
      entry: ['**/*.ts'],
      ignore: ['**/_templates'],
    },
  },
  ignoreBinaries: ['eslint', 'only-allow'],
  ignoreDependencies: ['vitepress', '@secretlint/secretlint-rule-preset-recommend', 'nano-staged', 'size-limit', 'tsx', '@size-limit/file'],
  ignore: ['**/.wireit', '**/.vitepress', '**/dist/*.js', 'taze.config.js'],
}

export default config
