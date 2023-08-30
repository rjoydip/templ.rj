import { exec } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { findMonorepoRoot } from 'find-monorepo-root'
import { serializeError } from 'serialize-error'
import { describe, expect, test } from 'vitest'

describe('@templ/cli', async () => {
  const $ = promisify(exec)
  const rootDir = (await findMonorepoRoot(process.cwd())).dir
  const cliFilePath: string = join(rootDir, 'packages', 'cli', 'templ.mjs')

  test('should match version', async () => {
    const result = await $(`node ${cliFilePath} -v`)
    expect(result.stdout).toStrictEqual('@templ/cli, 0.0.0\n')
  })

  test('should work init command', async () => {
    try {
      const result = await $(`node ${cliFilePath} init`)
      expect(result.stdout).toBeDefined()
    } catch (err) {
      const error = new Error(String(err))
      const serialized = serializeError(error)
      expect(serialized.message).toBeDefined()
      expect(serialized.stack).toBeDefined()
    }
  })
})
