const ignoreFilePattern = '**/*.?(bench|config|load|story).?(c|m)[jt]s'
const entryPattern = '**/{src,modules}/**/*.?(c|m)[jt]s?(x)'
const testPattern = '**/test/**/*.test.?(c|m)[jt]s?(x)'

export default {
  'ignoreBinaries': ['test:e2e', 'templ-cli', 'test:storybook:ci'],
  'ignoreDependencies': ['@templ/config', '@vitest/coverage-v8', '@types/autocannon', 'autocannon', 'serve', 'typecheck', 'wait-on'],
  'workspaces': {
    '.': {
      ignore: ['**/{.config,coverage,dist,e2e-report,fixtures,templates}/**', ignoreFilePattern],
    },
    'packages/*': {
      entry: [entryPattern, testPattern, '**/.storybook/*.?(c|m)[jt]s?(x)'],
      ignore: [ignoreFilePattern],
    },
    'apps/*': {
      entry: [entryPattern, testPattern],
      ignore: [ignoreFilePattern],
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
  'next': {
    entry: [
      'next.config.{js,ts,cjs,mjs}',
      '{instrumentation,middleware}.{js,ts}',
      'app/global-error.{js,jsx,ts,tsx}',
      'app/**/{error,layout,loading,not-found,page,template}.{js,jsx,ts,tsx}',
      'app/**/{route,default}.{js,ts}',
      'app/{manifest,sitemap,robots}.{js,ts}',
      'app/**/{icon,apple-icon}.{js,jsx,ts,tsx}',
      'app/**/{opengraph,twitter}-image.{js,jsx,ts,tsx}',
      'pages/**/*.{js,jsx,ts,tsx}',
      'src/{instrumentation,middleware}.{js,ts}',
      'src/app/global-error.{js,jsx,ts,tsx}',
      'src/app/**/{error,layout,loading,not-found,page,template}.{js,jsx,ts,tsx}',
      'src/app/**/{route,default}.{js,ts}',
      'src/app/{manifest,sitemap,robots}.{js,ts}',
      'src/app/**/{icon,apple-icon}.{js,jsx,ts,tsx}',
      'src/app/**/{opengraph,twitter}-image.{js,jsx,ts,tsx}',
      'src/pages/**/*.{js,jsx,ts,tsx}',
    ],
  },
  'npm-package-json-lint': {
    config: [
      'package.json',
    ],
    project: ['app/**', 'packages/**', 'generator', 'scripts'],
  },
  'postcss': {
    config: ['postcss.config.{cjs,js}', 'postcss.config.json', 'package.json'],
  },
  'storybook': {
    config: ['.storybook/{main,test-runner}.{js,ts}'],
    entry: [
      '.storybook/{manager,preview}.{js,jsx,ts,tsx}',
      '**/*.@(mdx|stories.@(mdx|js|jsx|mjs|ts|tsx))',
    ],
    project: ['.storybook/**/*.{js,jsx,ts,tsx}'],
  },
  'tailwind': {
    config: ['tailwind.config.{js,cjs,mjs,ts}'],
  },
  'typescript': {
    config: ['tsconfig.json', 'tsconfig.*.json'],
  },
  // https://github.com/unjs/jiti/issues/194
  'vite': false,
  'vitest': false,
}
