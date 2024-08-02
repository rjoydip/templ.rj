import antfu from '@antfu/eslint-config'
import vitest from 'eslint-plugin-vitest'

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
  files: ['apps/admin/**/*.tsx'],
  rules: {
    'unicorn/prefer-node-protocol': 'off',
  },
}, {
  files: ['test/**'],
  plugins: {
    vitest,
  },
})
