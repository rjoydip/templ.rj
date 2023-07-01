import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import {
  isDataDirectoryExists,
  isJSONFile,
  isMarkdownFile,
  isMarkdownTemplateFile,
  isOutputDirectoryExists,
  isTemplateDirectoryExists,
} from '../src'

describe('Utils', async () => {
  test('File extension', () => {
    expect(isJSONFile('test-file.json')).toBeTruthy()
    expect(isMarkdownFile('test-file.md')).toBeTruthy()
    expect(isMarkdownTemplateFile('test-file.tmpl.md')).toBeTruthy()

    // Negative/Falsy
    expect(isJSONFile('test-file.jsonp')).toBeFalsy()
    expect(isMarkdownFile('test-file.mdx')).toBeFalsy()
    expect(isMarkdownTemplateFile('test-file.tmpl.mdx')).toBeFalsy()
  })

  test('Directory', () => {
    expect(
      isDataDirectoryExists(
        join(process.cwd(), '..', '..', 'fixtures', 'data'),
      ),
    ).toBeTruthy()
    expect(
      isOutputDirectoryExists(
        join(process.cwd(), '..', '..', 'fixtures', 'output'),
      ),
    ).toBeTruthy()
    expect(
      isTemplateDirectoryExists(
        join(process.cwd(), '..', '..', 'fixtures', 'template'),
      ),
    ).toBeTruthy()

    // Negative/Falsy
    expect(
      isDataDirectoryExists(
        join(process.cwd(), '..', '..', 'fixtures', 'data', 'dump'),
      ),
    ).toBeFalsy()
    expect(
      isOutputDirectoryExists(
        join(process.cwd(), '..', '..', 'fixtures', 'output', 'dump'),
      ),
    ).toBeFalsy()
    expect(
      isTemplateDirectoryExists(
        join(process.cwd(), '..', '..', 'fixtures', 'template', 'dump'),
      ),
    ).toBeFalsy()
  })
})
