import { join, parse } from 'node:path'
import { findMonorepoRoot } from 'find-monorepo-root'
import { describe, expect, test } from 'vitest'
import {
  DEFAULT_DATA_DIR,
  DEFAULT_DATA_FILE_EXTENSION,
  DEFAULT_TEMPLATE_DIR,
  DEFAULT_TEMPLATE_FILE_EXTENSION,
  getData,
  getTemplateFiles,
} from '../src'

describe('Get', async () => {
  const rootDir = (await findMonorepoRoot(process.cwd())).dir
  const fixturesPath = join(rootDir, 'fixtures')
  const tmplMdExt = DEFAULT_TEMPLATE_FILE_EXTENSION
  const jsonExt = DEFAULT_DATA_FILE_EXTENSION

  const dataDir = join(fixturesPath, DEFAULT_DATA_DIR)
  const tmplDir = join(fixturesPath, DEFAULT_TEMPLATE_DIR)

  test('template files', async () => {
    const tmplFiles = await getTemplateFiles(tmplDir, tmplMdExt)
    expect(tmplFiles.length).toBe(2)

    test('filename', async () => {
      const fName = parse(parse(tmplFiles[0]).name).name
      expect(fName).toBeDefined()
      expect(fName).not.toBeUndefined()

      test('data', async () => {
        const data = (await getData(dataDir, fName, jsonExt)) || ''
        expect(data).not.toBeUndefined()
        expect(data).toBeDefined()
      })

      test('template', async () => {
        const template = (await getData(tmplDir, fName, tmplMdExt)) || ''
        expect(template).toBeDefined()
        expect(template).not.toBeUndefined()
      })
    })
  })
})
