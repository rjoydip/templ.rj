import { configCreator } from './configCreator'

export const defaultConfig = {
  semi: false,
  tabWidth: 2,
  singleQuote: true,
  printWidth: 80,
  trailingComma: 'all',
  overrides: [
    {
      files: ['*.json5'],
      options: {
        singleQuote: false,
        quoteProps: 'preserve',
      },
    },
    {
      files: ['*.yml'],
      options: {
        singleQuote: false,
      },
    },
  ],
}

export const prettierConfig = configCreator</**
 * any on configCreator to avoid error "The inferred type of 'tsup' cannot
 * be named without a reference to '.../node_modules/tsup'. This is likely not
 * portable. A type annotation is necessary."
 */
any>(defaultConfig)
