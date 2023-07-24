import { exec } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { randomUUID } from 'node:crypto'
import { findMonorepoRoot } from 'find-monorepo-root'
import { serializeError } from 'serialize-error'
import { beforeEach, describe, expect, test } from 'vitest'

describe('@gfft/cli', async () => {
  let output_dir: string
  const $ = promisify(exec)
  const rootDir = (await findMonorepoRoot(process.cwd())).dir
  const fixturesPath = join(rootDir, 'fixtures')
  const cliFilePath: string = join(
    rootDir,
    'packages',
    'cli',
    'src',
    'index.ts',
  )

  beforeEach(() => {
    output_dir = `${join(fixturesPath, 'output', randomUUID())}`
  })

  test('Version', async () => {
    const result = await $(`esno ${cliFilePath} generate -v`)
    expect(result.stdout).toStrictEqual(`GFFT, 0.1.0\n`)
  })

  test('Without command', async () => {
    try {
      const result = await $(`esno ${cliFilePath}`)
      expect(result.stdout).toBeTruthy()
    } catch (err) {
      const error = new Error(String(err))
      const serialized = serializeError(error)
      expect(serialized.message).toBeDefined()
      expect(serialized.stack).toBeDefined()
    }
  })

  test('Without options', async () => {
    const result = await $(`esno ${cliFilePath} generate`)
    expect(result.stderr).toStrictEqual('Error: No options specified\n')
  })

  test('Data directory missing', async () => {
    const result = await $(
      `esno ${cliFilePath} generate -o ${output_dir} -t ${join(
        fixturesPath,
        'template',
      )}`,
    )
    expect(result.stderr).toStrictEqual('Error: Data directory not exists\n')
  })

  test('Template directory missing', async () => {
    const result = await $(
      `esno ${cliFilePath} generate -d ${join(
        fixturesPath,
        'data',
      )} -o ${output_dir}`,
    )
    expect(result.stderr).toStrictEqual(
      'Error: Template directory not exists\n',
    )
  })

  test('Missing output directory > Automatically create', async () => {
    const result = await $(
      `esno ${cliFilePath} generate -d ${join(fixturesPath, 'data')} -t ${join(
        fixturesPath,
        'template',
      )}`,
    )
    expect(JSON.parse(result.stdout).length).toBe(2)
  })

  test('Generate report', async () => {
    const result = await $(
      `esno ${cliFilePath} generate -d ${join(
        fixturesPath,
        'data',
      )} -o ${output_dir} -t ${join(fixturesPath, 'template')}`,
    )
    expect(JSON.parse(result.stdout).length).toBe(2)
  })
})
