import { argv } from 'node:process'
import { join } from 'node:path'
import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises'
import { compile } from 'tempura'
import { z } from 'zod'
import { createLogger, logError } from '@templ/logger'
import {
  COMPLETED,
  STARTED,
  pkgRoot
} from '@templ/utils'


/**
 * The function `getTemplateData` reads a file from a specified location and returns its contents as a
 * string.
 * @param location - The `location` parameter represents the directory location where the file is
 * located. It should be a string that specifies the path to the directory.
 * @param fileName - The `fileName` parameter is a string that represents the name of the file you want
 * to read.
 * @param [encoding=utf8] - The `encoding` parameter specifies the character encoding to be used when
 * reading the file. It is set to `'utf8'` by default, which means that the file will be read as a
 * UTF-8 encoded text file. However, you can specify a different encoding if needed, such as `'
 * @returns a promise. If the `result` object is successfully parsed and does not have any errors, the
 * function will read the file using `fs.readFile` and return the contents of the file as a string. If
 * there are any errors in parsing the `result` object, the function will reject the promise and return
 * the error.
 */
async function getTemplateData(
  location: string,
  fileName: string,
): Promise<string> {
  const result = z.object({
    location: z.string().nonempty('Location field is required'),
    fileName: z.string().nonempty('FileName field is required'),
  })

  try {
    result.safeParse({
      location,
      fileName,
    })
    return (await readFile(join(location, fileName))).toString()
  } catch (error) {
    logError(new Error(String(error)))
    return ''
  }
}

/**
 * The function `setTemplateData` is an asynchronous function that takes in a location, file name,
 * data, and optional encoding, and writes the data to a file at the specified location with the
 * specified file name.
 * @param location - The `location` parameter represents the directory where the file will be saved.
 * @param fileName - The `fileName` parameter is a string that represents the name of the file you want
 * to create or overwrite.
 * @param data - The `data` parameter in the `setTemplateData` function is a string that represents the
 * content of the file you want to write. It could be any text or data that you want to save to a file.
 * @param [encoding=utf8] - The `encoding` parameter specifies the character encoding to be used when
 * writing the file. It determines how the data will be encoded into bytes before being written to the
 * file. The default value is `'utf8'`, which is a widely used encoding for representing Unicode
 * characters.
 * @returns a promise. If the result of parsing the input parameters is successful, it will call
 * `fs.outputFile` and return a promise that resolves when the file is written. If the parsing fails,
 * it will return a rejected promise with the error from the parsing result.
 */
async function setTemplateData(
  location: string,
  fileName: string,
  data: string,
): Promise<void> {
  const result = z.object({
    location: z.string().nonempty('Location field is required'),
    fileName: z.string().nonempty('FileName field is required'),
    data: z.string().nonempty('Data field is required'),
  })

  try {
    result.safeParse({
      location,
      fileName,
      data,
    })
    await writeFile(join(location, fileName), data)
  } catch (error) {
    logError(new Error(String(error)))
  }
}


void (async () => {
  const name = argv.at(2) || 'templP'
  const logger = createLogger()
  try {
    const result = z.object({
      name: z.string(),
    })
    if (result) {
      logger.success(`[${STARTED}]: ${name} package generate`)
      const templatesLocation = join(process.cwd(), '_templates')
      const outputLocation = pkgRoot

      const indexTestTSTemplate = await getTemplateData(
        join(templatesLocation, 'test'),
        'index.test.ts.hbs',
      )
      const pkgTemplate = await getTemplateData(
        join(templatesLocation),
        'package.json.hbs',
      )
      const mdTemplate = await getTemplateData(
        join(templatesLocation),
        'README.md.hbs',
      )
      const tsconfigTemplate = await getTemplateData(
        join(templatesLocation),
        'tsconfig.json.hbs',
      )

      Promise.allSettled([
        await mkdir(join(outputLocation, name)),
        await mkdir(join(outputLocation, name, 'src')),
        await mkdir(join(outputLocation, name, 'test')),
        await copyFile(
          join(templatesLocation, 'src', 'index.ts'),
          join(outputLocation, name, 'src', 'index.ts'),
        ),
        await copyFile(
          join(templatesLocation, '.eslintignore'),
          join(outputLocation, name, '.eslintignore'),
        ),
        await copyFile(
          join(templatesLocation, '.eslintrc'),
          join(outputLocation, name, '.eslintrc'),
        ),
        await setTemplateData(
          join(outputLocation, name, 'test'),
          'index.test.ts',
          await compile(indexTestTSTemplate)({ name }),
        ),
        await setTemplateData(
          join(outputLocation, name),
          'package.json',
          await compile(pkgTemplate)({ name }),
        ),
        await setTemplateData(
          join(outputLocation, name),
          'README.md',
          await compile(mdTemplate)({ name }),
        ),
        await setTemplateData(
          join(outputLocation, name),
          'tsconfig.json',
          await compile(tsconfigTemplate)({ name }),
        ),
        await copyFile(
          join(templatesLocation, 'tsup.config.ts'),
          join(outputLocation, name, 'tsup.config.ts'),
        ),
        await copyFile(
          join(templatesLocation, 'vitest.config.ts'),
          join(outputLocation, name, 'vitest.config.ts'),
        ),
      ])
      logger.success(`[${COMPLETED}]: ${name} package generate`)
    } else {
      throw Error('Type validation failed')
    }
  } catch (error) {
    logError(error)
  }
})()
