import path from 'node:path'
import { execa } from 'execa'
import { describe, expect, it } from 'vitest'
import { getGlobalDirectory } from '../src/global-directory'

async function pnpm(arguments_) {
  const { stdout } = await execa('pnpm', arguments_)
  return stdout
}

describe('pnpm > global directory', async () => {
  const globalDirectory = await getGlobalDirectory()

  it('pnpm.prefix', async () => {
    const expectedResult = await pnpm(['prefix', '--global'])
    expect(globalDirectory.pnpm.prefix).toBe(expectedResult)
  })

  it('pnpm.packages', async () => {
    const expectedResult = await pnpm(['root', '--global'])
    expect(globalDirectory.pnpm.packages).toBe(expectedResult)
  })

  it('pnpm.binaries', async () => {
    const expectedResult = await pnpm(['bin', '--global'])
    expect(globalDirectory.pnpm.binaries).toBe(path.join(expectedResult))
  })

  it('pnpm', async () => {
    await pnpm(['install', '--global', 'pnpm'])
    expect(globalDirectory.pnpm).toBeTruthy()
    expect(globalDirectory.pnpm.prefix).toBeTruthy()
    expect(globalDirectory.pnpm.packages).toBeTruthy()
    expect(globalDirectory.pnpm.binaries).toBeTruthy()
  })
})
