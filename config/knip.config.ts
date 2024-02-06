import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  'rules': {
    files: 'warn',
  },
  'ignore': ['**/test/**', '**/templates/**', '**/apps/web/**'],
  'ignoreBinaries': ['templ-cli'],
  'workspaces': {
    '.': {
      entry: ['config/vitest.shared.js'],
    },
    'config/*': {
      entry: ['src/**/.ts', '*.shared.js'],
    },
    'packages/*': {
      entry: ['src/**/.ts', '*.config.ts'],
    },
    'apps/*': {
      entry: ['src/**/.ts', '*.config.ts'],
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
  'vite': {
    config: ['vite*.config.{js,mjs,ts,cjs,mts,cts}'],
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
