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
} from '@gfft/utils'
import { generateOutput } from '../src'

describe('Core', async () => {
  const rootDir = (await findMonorepoRoot(process.cwd())).dir
  const fixturesPath = join(rootDir, 'fixtures')
  const tmplMdExt = DEFAULT_TEMPLATE_FILE_EXTENSION
  const jsonExt = DEFAULT_DATA_FILE_EXTENSION

  const dataDir = join(fixturesPath, DEFAULT_DATA_DIR)
  const tmplDir = join(fixturesPath, DEFAULT_TEMPLATE_DIR)

  test('Generate Output', async () => {
    const output = await generateOutput(`Hello {{title}}`, { title: 'world' })
    expect(output).toBeDefined()
    expect(output).toBe('Hello world')
  })

  test('Generate Report', async () => {
    const tmplFiles = await getTemplateFiles(tmplDir, tmplMdExt)
    expect(tmplFiles.length).toBe(2)

    return await Promise.all([
      ...tmplFiles.map(async (fileName: string) => {
        const fName = parse(parse(fileName).name).name
        expect(fName).toBeDefined()
        expect(fName).not.toBeUndefined()
        const data = (await getData(dataDir, fName, jsonExt)) || ''
        expect(data).not.toBeUndefined()
        expect(data).toBeDefined()
        const template = (await getData(tmplDir, fName, tmplMdExt)) || ''
        expect(template).toBeDefined()
        expect(template).not.toBeUndefined()
        const generatedOp = await generateOutput(template, JSON.parse(data))
        expect(generatedOp).toBeDefined()
        expect(generatedOp).not.toBeUndefined()
      }),
    ])
  })
})
