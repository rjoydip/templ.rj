import { exec } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { serializeError } from 'serialize-error'
import { describe, expect, it } from 'vitest'

describe('@templ/cli', async () => {
  const $ = promisify(exec)
  const rootDir = await $('git rev-parse --show-toplevel')
  const cliFilePath: string = join(rootDir.stdout.replace('\n', ''), 'packages', 'cli', 'templ.mjs')

  it('should match version', async () => {
    const result = await $(`node ${cliFilePath} -v`)
    expect(result.stdout).toStrictEqual('@templ/cli, 0.0.0\n')
  })

  it('should work init command', async () => {
    try {
      const result = await $(`node ${cliFilePath} init`)
      expect(result.stdout).toBeDefined()
    }
    catch (err) {
      const error = new Error(String(err))
      const serialized = serializeError(error)
      expect(serialized.message).toBeDefined()
      expect(serialized.stack).toBeDefined()
    }
  })
})
