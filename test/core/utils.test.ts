import { describe, expect, test } from 'vitest'
import { isDataDirectoryExists, isJSONFile, isMarkdownFile, isMarkdownTemplateFile, isOutputDirectoryExists, isTemplateDirectoryExists } from '../../packages/core/src/utils'

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
    expect(isDataDirectoryExists('test/fixtures/data')).toBeTruthy()
    expect(isOutputDirectoryExists('test/fixtures/output')).toBeTruthy()
    expect(isTemplateDirectoryExists('test/fixtures/template')).toBeTruthy()

    // Negative/Falsy
    expect(isDataDirectoryExists('test/fixtures/data/dump')).toBeFalsy()
    expect(isOutputDirectoryExists('test/fixtures/output//dump')).toBeFalsy()
    expect(isTemplateDirectoryExists('test/fixtures/template/dump')).toBeFalsy()
  })
})
