import { join } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
import type { ErrorObject} from 'serialize-error'
import { serializeError } from 'serialize-error'
import { z } from 'zod'

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
export async function getTemplateData(location: string, fileName: string): Promise<string> {
  const result = z
    .object({
      location: z.string().nonempty('Location field is required'),
      fileName: z.string().nonempty('FileName field is required'),
    })

  try {
    result.safeParse({
      location,
      fileName,
    })
    return await readFile(join(location, fileName)).toString()
  } catch (error) {
    serializeError(new Error(String(error)))
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
export async function setTemplateData(location: string, fileName: string, data: string  ): Promise<void> {
  const result = z
    .object({
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
    await writeFile(join(location, fileName), data).toString()
  } catch (error) {
    serializeError(new Error(String(error)))
  }
}
