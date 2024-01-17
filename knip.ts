import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  rules: {
    files: 'warn',
  },
  ignore: ['.github/**', 'templates/**', '**/fixtures/**'],
  workspaces: {
    '.': {
      entry: ['eslint.config.js'],
    },
    'packages/*': {
      entry: ['src/**/.ts', 'test/**/.test.ts'],
    },
    'scripts': {
      entry: ['src/**/.ts'],
    },
    'apps/api': {
      entry: ['src/**/.ts', 'test/**/.test.ts'],
      ignore: ['**/mocks/**', '**/api.test.ts'],
    },
  },
}

export default config
