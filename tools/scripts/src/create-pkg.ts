import { argv } from 'node:process'
import { join } from 'node:path'
import { mkdir, copyFile } from 'node:fs/promises'
import ora from 'ora'
import { compile } from 'tempura'
import { z } from 'zod'
import {
  COMPLETED,
  STARTED,
  getTemplateData,
  logError,
  setTemplateData,
} from '../utils'

void (async () => {
  const name = argv.at(2) || 'templP'
  const spinner = ora(`[${STARTED}]: Generate ${name} package`).start()
  try {
    const result = z.object({
      name: z.string(),
    })
    if (result) {
      const templatesLocation = join(process.cwd(), '_templates')
      const outputLocation = join(process.cwd(), '..', '..', 'packages')

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
      spinner.succeed(`[${COMPLETED}]: ${name} package generate`)
    } else {
      throw Error('Type validation failed')
    }
  } catch (error) {
    logError(error)
  }
})()
