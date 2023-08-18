import { lstatSync } from 'node:fs'
import { join } from 'node:path'
import fs from 'fs-extra'
import { glob } from 'glob'
import ora from 'ora'
import sade from 'sade'
import { serializeError } from 'serialize-error'
import { compile } from 'tempura'
import { z } from 'zod'
import { listBranches, pull } from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import { COMPLETED, STARTED } from './constants'

process.on('unhandledRejection', (reason, _) => {
  console.error(reason)
  process.exit(1)
})

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
async function getTemplateData(location, fileName, encoding = 'utf8') {
  const result = z
    .object({
      location: z.string(),
      fileName: z.string(),
    })
    .safeParse({
      location,
      fileName,
    })
  return result.success
    ? await fs.readFile(join(location, fileName), encoding)
    : Promise.reject(result.error)
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
async function setTemplateData(location, fileName, data, encoding = 'utf8') {
  const result = z
    .object({
      location: z.string(),
      fileName: z.string(),
      data: z.string(),
    })
    .safeParse({
      location,
      fileName,
      data,
    })
  return result.success
    ? await fs.outputFile(join(location, fileName), data, encoding)
    : Promise.reject(result.error)
}

/**
 * The function `logError` logs an error message and exits the process with a failure status.
 * @param err - The `err` parameter is the error object that you want to log. It can be any type of
 * error, such as an instance of the `Error` class or a custom error object.
 */
function logError(err) {
  const error = new Error(String(err))
  const serialized = serializeError(error)
  ora().fail(serialized.message)
  process.exit(1)
}

void (async function () {
  const prog = sade('templ')

  const cleanNMTxt = 'Clean node_modules directories and re-install packages'
  prog
    .command('clean:nm')
    .describe(cleanNMTxt)
    .example('clean:nm')
    .action(async () => {
      try {
        console.log(`[${STARTED}]: ${cleanNMTxt}`)
        await Promise.allSettled([
          ...(await glob('**/node_modules', { cwd: join(process.cwd(), '..') }))
            .reverse()
            .map(async (i) => {
              await fs.rm(join(process.cwd(), '..', i), {
                force: true,
                recursive: true,
              })
            }),
        ])
        console.log(`[${COMPLETED}]: ${cleanNMTxt}`)
        process.exit(0)
      } catch (error) {
        logError(error)
      }
    })

  prog
    .command('generate:pkg [name]')
    .describe('Generate new package')
    .option('-o, --out', 'Output location', 'packages')
    .example('generate:pkg foo -o packages')
    .action(async (name, opts) => {
      const spinner = ora(`[${STARTED}]: Generate ${name} package`).start()
      try {
        const result = z.object({
          name: z.string(),
          out: z.string(),
        })
        if (result) {
          const templatesLocation = join(process.cwd(), '_templates')
          const outputLocation = join('..', opts.out)
          const indexTSTemplate = await getTemplateData(
            join(templatesLocation, 'src'),
            'index.ts.hbs',
          )
          const indexTestTSTemplate = await getTemplateData(
            join(templatesLocation, 'test'),
            'index.test.ts.hbs',
            'utf8',
          )
          const pkgTemplate = await getTemplateData(
            join(templatesLocation),
            'package.json.hbs',
            'utf8',
          )
          const mdTemplate = await getTemplateData(
            join(templatesLocation),
            'README.md.hbs',
            'utf8',
          )
          const tsconfigTemplate = await getTemplateData(
            join(templatesLocation),
            'tsconfig.json.hbs',
            'utf8',
          )
          const tsupConfigTemplate = await getTemplateData(
            join(templatesLocation),
            'tsup.config.ts.hbs',
            'utf8',
          )
          const turboTemplate = await getTemplateData(
            join(templatesLocation),
            'turbo.json.hbs',
            'utf8',
          )
          const vitestConfigTemplate = await getTemplateData(
            join(templatesLocation),
            'vitest.config.ts.hbs',
            'utf8',
          )

          Promise.allSettled([
            await setTemplateData(
              join(outputLocation, name, 'src'),
              'index.ts',
              compile(indexTSTemplate)({}),
              'utf8',
            ),
            await setTemplateData(
              join(outputLocation, name, 'test'),
              'index.test.ts',
              compile(indexTestTSTemplate)({}),
              'utf8',
            ),
            await setTemplateData(
              join(outputLocation, name),
              'package.json',
              compile(pkgTemplate)({ name }),
              'utf8',
            ),
            await setTemplateData(
              join(outputLocation, name),
              'README.md',
              compile(mdTemplate)({ name }),
              'utf8',
            ),
            await setTemplateData(
              join(outputLocation, name),
              'tsconfig.json',
              compile(tsconfigTemplate)({ name }),
              'utf8',
            ),
            await setTemplateData(
              join(outputLocation, name),
              'tsup.config.ts',
              compile(tsupConfigTemplate)({}),
              'utf8',
            ),
            await setTemplateData(
              join(outputLocation, name),
              'turbo.json',
              compile(turboTemplate)({}),
              'utf8',
            ),
            await setTemplateData(
              join(outputLocation, name),
              'vitest.config.ts',
              compile(vitestConfigTemplate)({}),
              'utf8',
            ),
          ])
          spinner.succeed(`[${COMPLETED}]: ${name} package generate`)
          process.exit(0)
        } else {
          throw Error('Type validation failed')
        }
      } catch (error) {
        logError(error)
      }
    })

  prog
    .command('update:third_party')
    .describe('Update branch for all third_party applications')
    .example('update:third_party')
    .action(async () => {
      try {
        console.log('[STARTED]: Update branch for all third_party applications')
        await Promise.allSettled([
          ...(await glob('third_party/*', { cwd: join(process.cwd(), '..'), absolute: true }))
            .filter(i => lstatSync(i).isDirectory())
            .map(async (dir) => {
              const branches = await listBranches({ fs, dir })
              const mainOrMasterBranch = branches.filter(i => i.includes('master') || i.includes('main')).pop()
              await pull({
                fs,
                http,
                dir,
                ref: mainOrMasterBranch,
                singleBranch: true
              })
              return true
            }),
        ])
        console.log('[COMPLETED]: Update branch for all third_party applications')
        process.exit(0)
      } catch (error) {
        logError(error)
      }
    })

  prog.parse(process.argv)
})()
