import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  'rules': {
    files: 'warn',
  },
  'ignore': ['**/test/**'],
  'ignoreBinaries': ['templ-cli'],
  'workspaces': {
    'packages/*': {
      entry: ['src/**/.ts', 'esbuild.config.ts'],
    },
    'apps/server': {
      entry: ['src/**/.ts', 'esbuild.config.ts', 'package.json'],
    },
  },
  'eslint': {
    config: [
      'eslint.config.js',
      '.eslintrc',
      '.eslintrc.{js,json,cjs}',
      '.eslintrc.{yml,yaml}',
      'package.json',
    ],
  },
  'github-actions': {
    config: ['.github/workflows/*.{yml,yaml}', '.github/**/action.{yml,yaml}'],
  },
  'lefthook': {
    config: [
      'lefthook.yml',
      '.git/hooks/prepare-commit-msg',
      '.git/hooks/commit-msg',
      '.git/hooks/pre-{applypatch,commit,merge-commit,push,rebase,receive}',
      '.git/hooks/post-{checkout,commit,merge,rewrite}',
    ],
  },
  'npm-package-json-lint': {
    config: [
      'package.json',
    ],
  },
  'typescript': {
    config: ['tsconfig.json', 'tsconfig.*.json'],
  },
  'vitest': {
    config: [
      'vitest*.config.{js,mjs,ts,cjs,mts,cts}',
      'vitest.{workspace,projects}.{ts,js,json}',
    ],
    entry: ['**/*.{test,test-d,spec}.?(c|m)[jt]s?(x)'],
  },
}

export default config
