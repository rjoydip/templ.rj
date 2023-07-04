import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { $ } from 'execa'
import { serializeError } from 'serialize-error'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import pkgInfo from '../src/utils/pkg-info'

describe('Cli', async () => {
  let output_dir: string
  const cliFilePath: string = 'src/index.ts'
  const fixturesPath = join(process.cwd(), '..', '..', 'fixtures')

  beforeAll(async () => {
    await $`rm -rf ${join(fixturesPath, 'output', '*')}`
  })

  beforeEach(() => {
    output_dir = `${join(fixturesPath, 'output', randomUUID())}`
  })

  afterAll(async () => {
    await $`rm -rf ${join(fixturesPath, 'output', '*')}`
  })

  test('Version', async () => {
    const pkg = await pkgInfo()
    const result = await $`esno ${cliFilePath} generate -v`
    expect(result.stdout).toStrictEqual(`${pkg.name}, ${pkg.version}`)
  })

  test('Without command', async () => {
    try {
      const result = await $`esno ${cliFilePath}`
      expect(result.failed).toBeTruthy()
    } catch (err) {
      const error = new Error(String(err))
      const serialized = serializeError(error)
      expect(serialized.message).toBeDefined()
      expect(serialized.stack).toBeDefined()
    }
  })

  test('Without options', async () => {
    const result = await $`esno ${cliFilePath} generate`
    expect(result.stderr).toStrictEqual('Error: No options specified')
  })

  test('Data directory missing', async () => {
    const result =
      await $`esno ${cliFilePath} generate -o ${output_dir} -t ${join(
        fixturesPath,
        'template',
      )}`
    expect(result.stderr).toStrictEqual('Error: Data directory not exists')
  })

  test('Template directory missing', async () => {
    const result = await $`esno ${cliFilePath} generate -d ${join(
      fixturesPath,
      'data',
    )} -o ${output_dir}`
    expect(result.stderr).toStrictEqual('Error: Template directory not exists')
  })

  test('Missing output directory > Automatically create', async () => {
    const result = await $`esno ${cliFilePath} generate -d ${join(
      fixturesPath,
      'data',
    )} -t ${join(fixturesPath, 'template')}`
    expect(JSON.parse(result.stdout).length).toBe(2)
  })

  test('Generate report', async () => {
    const result = await $`esno ${cliFilePath} generate -d ${join(
      fixturesPath,
      'data',
    )} -o ${output_dir} -t ${join(fixturesPath, 'template')}`
    expect(JSON.parse(result.stdout).length).toBe(2)
  })
})
