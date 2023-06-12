import { parse, resolve } from 'path'
import { readdir } from 'fs/promises'
import { describe, expect, test } from 'vitest'
import { generateOutput, getData, getTemplateFiles, writeOutput } from '../../packages/core/src'

describe('Core', async () => {
  let tmplFiles: any[] = []

  const mdExt = '.md'
  const tmplMdExt = '.tmpl.md'
  const jsonExt = '.json'

  const dataDir = `${resolve(__dirname)}/data`
  const outputDir = `${resolve(__dirname)}/output`
  const tmplDir = `${resolve(__dirname)}/templates`

  tmplFiles = await getTemplateFiles(tmplDir, tmplMdExt)

  test('Extension', () => {
    expect(mdExt).toContain('.md')
    expect(tmplMdExt).toContain('.tmpl.md')
    expect(jsonExt).toContain('.json')
  })

  test('Directory', () => {
    expect(dataDir).toContain('data')
    expect(outputDir).toContain('output')
    expect(tmplDir).toContain('templates')
  })

  test('Template files', async () => {
    expect(tmplFiles.length).toBe(2)
  })

  test('Output', async () => {
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
        await writeOutput(outputDir, fName, mdExt, generatedOp)
        expect((await readdir(outputDir)).length - 1).toBe(2)
      }),
    ])
  })
})
