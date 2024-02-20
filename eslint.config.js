import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: true,
  typescript: true,
  jsonc: true,
  markdown: true,
}, {
  ignores: ['**/app/{docs,web}', '**/fixtures', '**/templates'],
  rules: {
    'antfu/no-import-dist': 'off',
  },
})
