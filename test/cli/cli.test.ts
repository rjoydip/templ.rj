import { randomUUID } from 'crypto'
import { $ } from 'execa'
import { serializeError } from 'serialize-error'
import { beforeAll, beforeEach, describe, expect, test } from 'vitest'

describe('Cli', async () => {
  let output_dir: string

  beforeAll(async () => {
    await $`rm -rf test/fixtures/output/*`
  })

  beforeEach(() => {
    output_dir = `test/fixtures/output/${randomUUID()}`
  })

  test('Cli version', async () => {
    const result = await $`esno packages/cli/src/cli.ts generate -v`
    expect(result.stdout).toStrictEqual('grft, 0.1.0')
  })

  test('Without command', async () => {
    try {
      const result = await $`esno packages/cli/src/cli.ts`
      expect(result.failed).toBeTruthy()
    }
    catch (err) {
      const error = new Error(String(err))
      const serialized = serializeError(error)
      expect(serialized.message).toBeDefined()
      expect(serialized.stack).toBeDefined()
    }
  })

  test('Without options', async () => {
    const result = await $`esno packages/cli/src/cli.ts generate`
    expect(result.stderr).toStrictEqual('Error: No options specified')
  })

  test('Data directory missing', async () => {
    const result = await $`esno packages/cli/src/cli.ts generate -o ${output_dir} -t test/fixtures/template`
    console.log(result)
    expect(result.stderr).toStrictEqual('Error: Data directory not exists')
  })

  test('Template directory missing', async () => {
    const result = await $`esno packages/cli/src/cli.ts generate -d test/fixtures/data -o ${output_dir}`
    expect(result.stderr).toStrictEqual('Error: Template directory not exists')
  })

  test('Missing output directory > Automatically create', async () => {
    const result = await $`esno packages/cli/src/cli.ts generate -d test/fixtures/data -t test/fixtures/template`
    expect(JSON.parse(result.stdout).length).toBe(2)
  })

  test('Generate report', async () => {
    const result = await $`esno packages/cli/src/cli.ts generate -d test/fixtures/data -o ${output_dir} -t test/fixtures/template`
    expect(JSON.parse(result.stdout).length).toBe(2)
  })
})
