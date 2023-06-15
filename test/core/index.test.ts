import { join, parse } from 'path'
import { describe, expect, test } from 'vitest'
import { DEFAULT_DATA_DIR, DEFAULT_DATA_FILE_EXTENSION, DEFAULT_TEMPLATE_DIR, DEFAULT_TEMPLATE_FILE_EXTENSION, generateOutput, getData, getTemplateFiles } from '../../packages/core/src'

describe('Core', async () => {
  const tmplMdExt = DEFAULT_TEMPLATE_FILE_EXTENSION
  const jsonExt = DEFAULT_DATA_FILE_EXTENSION

  const dataDir = join('test', 'fixtures', DEFAULT_DATA_DIR)
  const tmplDir = join('test', 'fixtures', DEFAULT_TEMPLATE_DIR)

  test('Output', async () => {
    const tmplFiles = await getTemplateFiles(tmplDir, tmplMdExt)
    expect(tmplFiles.length).toBe(2)

    return await Promise.all([
      ...tmplFiles.map(async (fileName: string) => {
        const fName = parse(parse(fileName).name).name
        expect(fName).toBeDefined()
        expect(fName).not.toBeUndefined()
        const data = await getData(dataDir, fName, jsonExt) || ''
        expect(data).not.toBeUndefined()
        expect(data).toBeDefined()
        const template = await getData(tmplDir, fName, tmplMdExt) || ''
        expect(template).toBeDefined()
        expect(template).not.toBeUndefined()
        const generatedOp = await generateOutput(
          template,
          JSON.parse(data),
        )
        expect(generatedOp).toBeDefined()
        expect(generatedOp).not.toBeUndefined()
      }),
    ])
  })
})
