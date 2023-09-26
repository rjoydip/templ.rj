import fg from 'fast-glob'
import markdownlint from 'markdownlint'
import { createLogger } from '@templ/logger'

// https://github.com/DavidAnson/markdownlint#rules
// https://github.com/DavidAnson/markdownlint/blob/master/doc/Rules.md
const config = {
  'default': true,
  // Exclusions for deliberate/widespread violations
  'MD001': true, // Header levels should only increment by one level at a time
  'MD002': false, // First header should be a h1 header
  'MD003': {
    // Header should be `# first level #`
    style: 'atx',
  },
  'MD007': {
    // Unordered list indentation
    indent: 4,
  },
  'MD012': false, // Multiple consecutive blank lines
  'MD013': { line_length: 1000 }, // Line length

  // MD019: false, // Multiple spaces after hash on atx style header
  // MD021: false, // Multiple spaces inside hashes on closed atx style header
  'MD022': false, // Headers should be surrounded by blank lines (disabled for denser @@@example blocks)
  // MD024: false, // Multiple headers with the same content
  'MD026': {
    // Trailing punctuation in header
    punctuation: '.,;:!',
  },
  // MD029: false, // Ordered list item prefix
  // MD030: false, // Spaces after list markers
  'MD033': false,
  // MD034: false, // Bare URL used
  // MD040: false,  // Fenced code blocks should have a language specified
  'MD041': false,
  'no-hard-tabs': false,
  'whitespace': false,
}

markdownlint(
  {
    files: fg.sync('{*.md,{.github,packages,fixtures}/**/*.md}', {
      ignore: ['**/node_modules/**'],
    }),
    frontMatter: /(^---$[\s\S]+?^---\$)?(\r\n|\r|\n)+/m,
    config,
  },
  (err, result) => {
    const logger = createLogger()
    if (err)
      logger.error(String(err))

    const resultString = result?.toString()
    if (resultString)
      logger.error(resultString)
  },
)
