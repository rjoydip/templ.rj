import { argv } from 'node:process'
import { join, normalize } from 'node:path'
import ora from 'ora'
import { compile } from 'tempura'
import { z } from 'zod'
import { COMPLETED, STARTED, getTemplateData, logError, setTemplateData } from './utils'

void(async() => {
  const name = argv.at(2) || 'templP'
  const spinner = ora(`[${STARTED}]: Generate ${name} package`).start()
  try {
    const result = z.object({
      name: z.string(),
    })
    if (result) {
      const templatesLocation = normalize(join(process.cwd(), '_templates'))
      const outputLocation = normalize(join('..', 'packages'))
      const indexTSTemplate = await getTemplateData(
        join(templatesLocation, 'src'),
        'index.ts.hbs',
      )
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
      const tsupConfigTemplate = await getTemplateData(
        join(templatesLocation),
        'tsup.config.ts.hbs',
      )
      const turboTemplate = await getTemplateData(
        join(templatesLocation),
        'turbo.json.hbs',
      )
      const vitestConfigTemplate = await getTemplateData(
        join(templatesLocation),
        'vitest.config.ts.hbs',
      )

      Promise.allSettled([
        await setTemplateData(
          join(outputLocation, name, 'src'),
          'index.ts',
          await compile(indexTSTemplate)({}),
        ),
        await setTemplateData(
          join(outputLocation, name, 'test'),
          'index.test.ts',
          await compile(indexTestTSTemplate)({}),
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
        await setTemplateData(
          join(outputLocation, name),
          'tsup.config.ts',
          await compile(tsupConfigTemplate)({}),
        ),
        await setTemplateData(
          join(outputLocation, name),
          'turbo.json',
          await compile(turboTemplate)({}),
        ),
        await setTemplateData(
          join(outputLocation, name),
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
