import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: true,
  typescript: true,
  jsonc: true,
  markdown: true,
}, {
  ignores: ['**/artifacts/**', '**/fixtures/**', '**/templates/**'],
  rules: {
    'antfu/no-import-dist': 'off',
  },
}, {
  files: ['**/*.bench.ts'],
  rules: {
    'test/consistent-test-it': 'off',
  },
}, {
  files: ['apps/admin/**/*.tsx'],
  rules: {
    'unicorn/prefer-node-protocol': 'off',
  },
})
