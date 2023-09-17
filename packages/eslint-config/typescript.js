const fs = require('node:fs')
const { join } = require('node:path')
const process = require('node:process')
const javascript = require('./javascript')

const tsconfig = process.env.ESLINT_TSCONFIG || 'tsconfig.eslint.json'

module.exports = {
  extends: [
    'prettier',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['prettier'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.d.ts'],
      },
    },
  },
  overrides: javascript.overrides.concat(
    !fs.existsSync(join(process.cwd(), tsconfig))
      ? []
      : [
          {
            parserOptions: {
              tsconfigRootDir: process.cwd(),
              project: [tsconfig],
            },
            parser: '@typescript-eslint/parser',
            excludedFiles: ['**/*.md/*.*'],
            files: ['*.ts', '*.tsx', '*.mts', '*.cts'],
            // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/recommended-requiring-type-checking.ts
            rules: {
              'prettier/prettier': 'error',

              'no-throw-literal': 'off',
              'no-implied-eval': 'off',
              'require-await': 'off',
              'dot-notation': 'off',
              '@typescript-eslint/no-throw-literal': 'error',
              '@typescript-eslint/no-implied-eval': 'error',
              '@typescript-eslint/no-floating-promises': 'error',
              '@typescript-eslint/no-misused-promises': 'error',
              '@typescript-eslint/await-thenable': 'error',
              '@typescript-eslint/no-for-in-array': 'error',
              '@typescript-eslint/no-unnecessary-type-assertion': 'error',
              '@typescript-eslint/no-unsafe-argument': 'error',
              '@typescript-eslint/no-unsafe-assignment': 'error',
              '@typescript-eslint/no-unsafe-call': 'error',
              '@typescript-eslint/no-unsafe-member-access': 'error',
              '@typescript-eslint/no-unsafe-return': 'error',
              '@typescript-eslint/require-await': 'error',
              '@typescript-eslint/restrict-plus-operands': 'error',
              '@typescript-eslint/restrict-template-expressions': 'error',
              '@typescript-eslint/unbound-method': 'error',
              '@typescript-eslint/dot-notation': [
                'error',
                { allowKeywords: true },
              ],
            },
          },
        ],
  ),
  rules: {
    'import/named': 'off',
    'no-invalid-this': 'off',
    'space-before-blocks': 'off',
    'space-infix-ops': 'off',
    'comma-spacing': 'off',
    'no-extra-parens': 'off',
    'lines-between-class-members': 'off',
    'no-dupe-class-members': 'off',
    'no-loss-of-precision': 'off',
    'keyword-spacing': 'off',
    'no-redeclare': 'off',
    'no-use-before-define': 'off',
    'brace-style': 'off',
    'object-curly-spacing': 'off',
    'no-useless-constructor': 'off',

    // typescript-eslint - error
    '@typescript-eslint/space-infix-ops': 'error',
    '@typescript-eslint/type-annotation-spacing': ['error', {}],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/space-before-blocks': ['error', 'always'],

    // typescript-eslint - off
    'space-before-function-paren': 'off',
    '@typescript-eslint/brace-style': 'off',
    '@typescript-eslint/consistent-indexed-object-style': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/parameter-properties': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',

    // typescript-eslint - no
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-invalid-this': 'error',
    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/no-extra-parens': ['error', 'functions'],
    '@typescript-eslint/no-dupe-class-members': 'error',
    '@typescript-eslint/no-loss-of-precision': 'error',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',

    // typescript-eslint - error with props
    '@typescript-eslint/ban-ts-comment': [
      'error',
      { 'ts-ignore': 'allow-with-description' },
    ],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      { multiline: { delimiter: 'none' } },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', disallowTypeAnnotations: false },
    ],
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: { parameters: 1, body: 1 },
        FunctionExpression: { parameters: 1, body: 1 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
        ignoredNodes: [
          'TemplateLiteral *',
          'JSXElement',
          'JSXElement > *',
          'JSXAttribute',
          'JSXIdentifier',
          'JSXNamespacedName',
          'JSXMemberExpression',
          'JSXSpreadAttribute',
          'JSXExpressionContainer',
          'JSXOpeningElement',
          'JSXClosingElement',
          'JSXFragment',
          'JSXOpeningFragment',
          'JSXClosingFragment',
          'JSXText',
          'JSXEmptyExpression',
          'JSXSpreadChild',
          'TSTypeParameterInstantiation',
          'FunctionExpression > .params[decorators.length > 0]',
          'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
          'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
        ],
        offsetTernaryExpressions: true,
      },
    ],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: false, variables: true },
    ],
    '@typescript-eslint/space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    '@typescript-eslint/keyword-spacing': [
      'error',
      { before: true, after: true },
    ],
    '@typescript-eslint/comma-spacing': [
      'error',
      { before: false, after: true },
    ],
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
  },
}
