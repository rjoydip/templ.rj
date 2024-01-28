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
    'apps/server': {
      entry: ['src/**/.ts', 'test/**/.test.ts'],
    },
  },
}

export default config
