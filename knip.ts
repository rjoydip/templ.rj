import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    'packages/*': {
      entry: 'src/index.ts',
      project: 'src/**/*.ts'
    },
    scripts: {
      project: 'src/**/*.ts'
    }
  },
  husky: {
    config: [
      '.husky/commit-msg',
      '.husky/pre-commit',
    ]
  },
  cspell: {
    config: ['cspell.config.{js,cjs,json,yaml,yml}', 'cspell.{json,yaml,yml}', '.c{s,S}pell.json', 'cSpell.json']
  },
  ignoreDependencies: ['@templ/config', '@templ/core', '@templ/docs', '@templ/logger', '@templ/utils'],
  ignoreExportsUsedInFile: true,
  ignoreBinaries: ['eslint', 'only-allow'],
  ignore: ['**/fixtures', '.wireit', '**/docs', '**/_templates', '**/*.d.ts', 'taze.config.js']
}

export default config
