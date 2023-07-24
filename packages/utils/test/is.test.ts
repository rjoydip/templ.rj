import { join } from 'node:path'
import { findMonorepoRoot } from 'find-monorepo-root'
import { describe, expect, test } from 'vitest'
import {
  isDataDirectoryExists,
  isJSONFile,
  isMarkdownFile,
  isMarkdownTemplateFile,
  isOutputDirectoryExists,
  isTemplateDirectoryExists,
} from '../src'

describe('@gfft/utils > Is', async () => {
  const rootDir = (await findMonorepoRoot(process.cwd())).dir
  const fixturesPath = join(rootDir, 'fixtures')
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
    expect(isDataDirectoryExists(join(fixturesPath, 'data'))).toBeTruthy()
    expect(isOutputDirectoryExists(join(fixturesPath, 'output'))).toBeTruthy()
    expect(
      isTemplateDirectoryExists(join(fixturesPath, 'template')),
    ).toBeTruthy()

    // Negative/Falsy
    expect(
      isDataDirectoryExists(join(fixturesPath, 'data', 'dump')),
    ).toBeFalsy()
    expect(
      isOutputDirectoryExists(join(fixturesPath, 'output', 'dump')),
    ).toBeFalsy()
    expect(
      isTemplateDirectoryExists(join(fixturesPath, 'template', 'dump')),
    ).toBeFalsy()
  })
})
