import { parse } from 'node:path'
import { writeFile } from 'node:fs/promises'
import {
  DEFAULT_DATA_DIR,
  DEFAULT_DATA_FILE_EXTENSION,
  DEFAULT_OUTPUT_FILE_EXTENSION,
  DEFAULT_TEMPLATE_DIR,
  DEFAULT_TEMPLATE_FILE_EXTENSION,
  createDirectory,
  generateOutput,
  getData,
  getTemplateFiles,
  isDataDirectoryExists,
  isOutputDirectoryExists,
  isTemplateDirectoryExists,
} from '.'

export async function generateReport({
  output_dir = DEFAULT_DATA_DIR,
  template_dir = DEFAULT_TEMPLATE_DIR,
  data_dir = DEFAULT_DATA_DIR,
  output_ext = DEFAULT_OUTPUT_FILE_EXTENSION,
  template_ext = DEFAULT_TEMPLATE_FILE_EXTENSION,
  data_ext = DEFAULT_DATA_FILE_EXTENSION,
}) {
  if (!isDataDirectoryExists(data_dir))
    throw new Error('Data directory not exists')

  if (!isTemplateDirectoryExists(template_dir))
    throw new Error('Template directory not exists')

  const tmplFiles = await getTemplateFiles(template_dir, template_ext)
  return await Promise.all([
    ...tmplFiles.map(async (fileName: string) => {
      try {
        const fName = parse(parse(fileName).name).name
        const data = (await getData(data_dir, fName, data_ext)) || ''
        const template =
          (await getData(template_dir, fName, template_ext)) || ''
        const generatedOp = await generateOutput(template, JSON.parse(data))

        if (!isOutputDirectoryExists(output_dir)) createDirectory(output_dir)

        await writeFile(`${output_dir}/${fName}${output_ext}`, generatedOp)
        return true
      } catch (error) {
        return false
      }
    }),
  ])
}
