import { exec } from 'node:child_process'
import { join, normalize } from 'node:path'
import { platform } from 'node:os'
import { promisify } from 'node:util'
import { deleteAsync } from 'del'
import fs from 'fs-extra'
import { glob } from 'glob'
import ora from 'ora'
import sade from 'sade'
import { serializeError } from 'serialize-error'
import { compile } from 'tempura'
import { z } from 'zod'

const $ = promisify(exec)

process.on('unhandledRejection', (reason, _) => {
  console.error(reason)
  process.exit(1)
})

async function getTemplateData(location, fileName, encoding = 'utf8') {
  const result = z.object({
    location: z.string(),
    fileName: z.string(),
  }).safeParse({
    location,
    fileName
  })
  return result.success ? await fs.readFile(join(location, fileName), encoding) : Promise.reject(result.error)
}

async function setTemplateData(location, fileName, data, encoding = 'utf8') {
  const result = z.object({
    location: z.string(),
    fileName: z.string(),
    data: z.string()
  }).safeParse({
    location,
    fileName,
    data
  })
  return result.success ? await fs.outputFile(join(location, fileName), data, encoding) : Promise.reject(result.error)
}

void async function () {
  const prog = sade('Commander')

  prog
    .command('clean')
    .describe('Clean unnecessary directories')
    .option('-nm, --nm', 'Clean node_modules directories')
    .example('clean')
    .example('clean --nm')
    .action(async (opts) => {
      try {
        if (z.boolean().safeParse(opts.nm).success) {
          if (platform() === 'win32') {
            console.log("[STARTED]: Node modules cleanup")
            if (process.env.SHELL && process.env.SHELL.includes('bash')) {
              await $('rm -rf node_modules packages/**/node_modules')
              console.log("[COMPLETED]: Node modules cleanup")
            } else {
              await Promise.allSettled([
                ...(await glob('packages/**/node_modules', {})).reverse().map(async i => {
                  await $(`rmdir /S /Q ${join(process.cwd(), i)}`)
                })
              ])
              await $(`rmdir /S /Q ${join(process.cwd(), "node_modules")}`)
              console.log("[COMPLETED]: Node modules cleanup")
            }
          } else if (platform() === 'linux') {
            if (process.env.SHELL && process.env.SHELL.includes('bash')) {
              await $('rm -rf node_modules packages/**/node_modules')
              console.log("[COMPLETED]: Node modules cleanup")
            }
          }
        } else {
          const spinner = ora(`[STARTED] Cleanup`).start()
          await deleteAsync(['.turbo', '.eslintcache', '.pnpm-store', 'coverage', 'packages/**/.nyc_output', 'packages/**/storybook-static', 'packages/**/.turbo', 'packages/**/dist', 'fixtures/output/**'], {});
          spinner.succeed(`[COMPLETED] Cleanup`)
        }
      } catch (err) {
        const error = new Error(String(err))
        const serialized = serializeError(error)
        ora().fail(serialized.message)
      }
    })

  prog
    .command('generate [name]')
    .describe('Generate new package')
    .option('-o, --out', 'Output location')
    .example('generate')
    .action(async (name, opts) => {
      const spinner = ora(`[STARTED]: Generate ${name} package`).start()
      try {
        const result = z.object({
          name: z.string(),
          out: z.string(),
        })
        if (result) {
          const templatesLocation = join(process.cwd(), '_templates')
          const outputLocation = join(process.cwd(), normalize(opts.out || ''))

          const indexTSTemplate = await getTemplateData(join(templatesLocation, 'src'), 'index.ts.hbs')
          const indexTestTSTemplate = await getTemplateData(join(templatesLocation, 'test'), 'index.test.ts.hbs', 'utf8')
          const pkgTemplate = await getTemplateData(join(templatesLocation), 'package.json.hbs', 'utf8')
          const mdTemplate = await getTemplateData(join(templatesLocation), 'README.md.hbs', 'utf8')
          const tsconfigTemplate = await getTemplateData(join(templatesLocation), 'tsconfig.json.hbs', 'utf8')
          const tsupconfigTemplate = await getTemplateData(join(templatesLocation), 'tsup.config.ts.hbs', 'utf8')
          const turboTemplate = await getTemplateData(join(templatesLocation), 'turbo.json.hbs', 'utf8')
          const vitestConfigTemplate = await getTemplateData(join(templatesLocation), 'vitest.config.ts.hbs', 'utf8')

          Promise.allSettled([
            await setTemplateData(join(outputLocation, name, 'src'), 'index.ts', compile(indexTSTemplate)({}), 'utf8'),
            await setTemplateData(join(outputLocation, name, 'test'), 'index.test.ts', compile(indexTestTSTemplate)({}), 'utf8'),
            await setTemplateData(join(outputLocation, name), 'package.json', compile(pkgTemplate)({ name }), 'utf8'),
            await setTemplateData(join(outputLocation, name), 'README.md', compile(mdTemplate)({ name }), 'utf8'),
            await setTemplateData(join(outputLocation, name), 'tsconfig.json', compile(tsconfigTemplate)({ name }), 'utf8'),
            await setTemplateData(join(outputLocation, name), 'tsup.config.ts', compile(tsupconfigTemplate)({}), 'utf8'),
            await setTemplateData(join(outputLocation, name), 'turbo.json', compile(turboTemplate)({}), 'utf8'),
            await setTemplateData(join(outputLocation, name), 'vitest.config.ts', compile(vitestConfigTemplate)({}), 'utf8'),
          ])
          spinner.succeed(`[COMPLETED]: ${name} package generate`)
        } else {
          throw Error(result.error)
        }
      } catch (err) {
        spinner.stop();
        const error = new Error(String(err))
        const serialized = serializeError(error)
        ora().fail(serialized.message)
      }
    })

  prog.parse(process.argv)
}()
