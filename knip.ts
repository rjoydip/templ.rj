import type { KnipConfig } from 'knip'

const ignoreDependencies = ['@templ/config', '@templ/core', '@templ/docs', '@templ/logger', '@templ/utils', '@secretlint/secretlint-rule-preset-recommend', '@size-limit/file', 'polka', 'serve-static', 'tempura', 'tsx', 'vue', 'nano-staged', 'size-limit', 'tsup', 'zod', 'markdownlint', 'vitepress']

const config: KnipConfig = {
  ignoreExportsUsedInFile: true,
  ignoreBinaries: ['eslint', 'only-allow'],
  ignoreDependencies,
  ignore: ['**/fixtures', '**/.wireit', '**/docs', '**/dist', '**/_templates', 'taze.config.js']
}

export default config
