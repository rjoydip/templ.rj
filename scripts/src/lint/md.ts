import { intro, log } from '@clack/prompts'
import fg from 'fast-glob'
import markdownlint from 'markdownlint'

// https://github.com/DavidAnson/markdownlint#rules
// https://github.com/DavidAnson/markdownlint/blob/master/doc/Rules.md
const config = {
  default: true,
  // Exclusions for deliberate/widespread violations
  MD001: true, // Header levels should only increment by one level at a time
  MD002: false, // First header should be a h1 header
  MD007: {
    // Unordered list indentation
    indent: 4,
  },
  MD012: false, // Multiple consecutive blank lines
  MD013: { line_length: 1000 }, // Line length

  // MD019: false, // Multiple spaces after hash on atx style header
  // MD021: false, // Multiple spaces inside hashes on closed atx style header
  MD022: false, // Headers should be surrounded by blank lines (disabled for denser @@@example blocks)
  // MD024: false, // Multiple headers with the same content
  MD026: {
    // Trailing punctuation in header
    punctuation: '.,;:!',
  },
  // MD029: false, // Ordered list item prefix
  // 'MD033': false,
  // MD034: false, // Bare URL used
  // MD040: false,  // Fenced code blocks should have a language specified
  // 'MD041': false,
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
    intro('Markdown lint')
    if (err)
      log.error(String(err))

    const resultString = result?.toString()
    if (resultString)
      log.error(resultString)
    else
      log.info('All looks good')
  },
)
