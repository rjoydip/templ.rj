import { argv } from 'node:process'
import { resolve } from 'node:path'
import { mkdir } from 'node:fs/promises'
import ora from 'ora'
import { compile } from 'tempura'
import { z } from 'zod'
import {
  COMPLETED,
  STARTED,
  getTemplateData,
  logError,
  setTemplateData,
} from './utils'

void (async () => {
  const name = argv.at(2) || 'templP'
  const spinner = ora(`[${STARTED}]: Generate ${name} package`).start()
  try {
    const result = z.object({
      name: z.string(),
    })
    if (result) {
      const templatesLocation = resolve(process.cwd(), '_templates')
      const outputLocation = resolve('..', 'packages')
      const indexTSTemplate = await getTemplateData(
        resolve(templatesLocation, 'src'),
        'index.ts.hbs',
      )
      const indexTestTSTemplate = await getTemplateData(
        resolve(templatesLocation, 'test'),
        'index.test.ts.hbs',
      )
      const pkgTemplate = await getTemplateData(
        resolve(templatesLocation),
        'package.json.hbs',
      )
      const mdTemplate = await getTemplateData(
        resolve(templatesLocation),
        'README.md.hbs',
      )
      const tsconfigTemplate = await getTemplateData(
        resolve(templatesLocation),
        'tsconfig.json.hbs',
      )
      const tsupConfigTemplate = await getTemplateData(
        resolve(templatesLocation),
        'tsup.config.ts.hbs',
      )
      const vitestConfigTemplate = await getTemplateData(
        resolve(templatesLocation),
        'vitest.config.ts.hbs',
      )

      Promise.allSettled([
        await mkdir(resolve(outputLocation, name)),
        await mkdir(resolve(outputLocation, name, 'src')),
        await mkdir(resolve(outputLocation, name, 'test')),
        await setTemplateData(
          resolve(outputLocation, name, 'src'),
          'index.ts',
          await compile(indexTSTemplate)({}),
        ),
        await setTemplateData(
          resolve(outputLocation, name, 'test'),
          'index.test.ts',
          await compile(indexTestTSTemplate)({ name }),
        ),
        await setTemplateData(
          resolve(outputLocation, name),
          'package.json',
          await compile(pkgTemplate)({ name }),
        ),
        await setTemplateData(
          resolve(outputLocation, name),
          'README.md',
          await compile(mdTemplate)({ name }),
        ),
        await setTemplateData(
          resolve(outputLocation, name),
          'tsconfig.json',
          await compile(tsconfigTemplate)({ name }),
        ),
        await setTemplateData(
          resolve(outputLocation, name),
          'tsup.config.ts',
          await compile(tsupConfigTemplate)({}),
        ),
        await setTemplateData(
          resolve(outputLocation, name),
          'vitest.config.ts',
          await compile(vitestConfigTemplate)({}),
        ),
      ])
      spinner.succeed(`[${COMPLETED}]: ${name} package generate`)
    } else {
      throw Error('Type validation failed')
    }
  } catch (error) {
    logError(error)
  }
})()
