import type { Stats } from 'node:fs'
import { existsSync } from 'node:fs'
import { intro, log } from '@clack/prompts'
import { totalist } from 'totalist/sync'
import markdownlint from 'markdownlint'
import { getRootDirSync, getWrappedStr } from 'src/utils'

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

const mdFiles: string[] = []
const root = getRootDirSync()

totalist(root, (name: string, abs: string, stats: Stats) => {
  if (!/node_modules|test|dist|coverage/.test(abs) && !stats.isSymbolicLink()) {
    if (/\*.md$/.test(name) && existsSync(abs))
      mdFiles.push(abs)
  }
})

markdownlint(
  {
    files: mdFiles,
    frontMatter: /(^---$[\s\S]+?^---\$)?(\r\n|\r|\n)+/m,
    config,
  },
  (err, result) => {
    intro('Markdown lint')
    if (err)
      log.error(getWrappedStr(String(err)))

    const resultString = result?.toString()
    if (resultString)
      log.error(getWrappedStr(resultString))
    else
      log.info('All looks good')
  },
)
