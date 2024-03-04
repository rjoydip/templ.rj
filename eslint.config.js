import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: true,
  javascript: true,
  typescript: true,
  json: true,
  jsonc: true,
  html: true,
  markdown: true,
  yaml: true,
  toml: true,
}, {
  ignores: ['**/app/{docs,web}', '**/fixtures', '**/templates'],
  rules: {
    'antfu/no-import-dist': 'off',
  },
}, {
  files: ['**/*.bench.ts'],
  rules: {
    'test/consistent-test-it': 'off',
  },
})
