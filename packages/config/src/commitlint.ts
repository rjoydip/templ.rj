import { configCreator } from './configCreator'

export const defaultConfig: any = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0, 'always', 150],
  },
}

export const commitlintConfig = configCreator(defaultConfig)
