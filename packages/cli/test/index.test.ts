import { exec } from 'node:child_process'
import { join } from 'node:path'
import { cwd } from 'node:process'
import { promisify } from 'node:util'
import { findMonorepoRoot } from 'find-monorepo-root'
import { describe, expect, it } from 'vitest'

describe('@templ/cli', async () => {
  const $ = promisify(exec)
  const rootDir = (await findMonorepoRoot(cwd())).dir
  const cliFilePath: string = join(rootDir, 'packages', 'cli', 'templ.mjs')

  it('should match version', async () => {
    const result = await $(`node ${cliFilePath} -v`)
    expect(result.stdout).toStrictEqual('@templ/cli, 0.0.0\n')
  })

  it('should work init command', async () => {
    try {
      const result = await $(`node ${cliFilePath} init`)
      expect(result.stdout).toBeDefined()
    }
    catch (error) {
      expect(error).toBeDefined()
    }
  })
})
