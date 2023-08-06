import { configCreator } from './configCreator'

/* The code is defining a variable named `defaultConfig` that is assigned an object. This object
represents the default configuration for a tool called `commitlint`. */
export const defaultConfig: any = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0, 'always', 150],
  },
}

/* The line `export const commitlintConfig = configCreator(defaultConfig)` is exporting a variable
named `commitlintConfig` that is assigned the result of calling the `configCreator` function with
`defaultConfig` as an argument. The `configCreator` function is likely a custom function that takes
a configuration object and returns a modified or enhanced version of that configuration. */
export const commitlintConfig = configCreator(defaultConfig)
