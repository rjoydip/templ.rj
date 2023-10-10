import { join, resolve } from 'node:path'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { escaladeAsync, escaladeSync } from '../src/escalade'

describe('@templ/utils > Escalade', () => {
  const fixtures = join(__dirname, 'fixtures')

  it('should export a function', () => {
    expectTypeOf(escaladeSync).toBeFunction()
  })

  it('should convert relative output into absolute', async () => {
    const output = await escaladeAsync(fixtures, async () => 'foobar.js')
    expect(output).toBe(join(fixtures, 'foobar.js'))
  })

  it('should respect absolute output', async () => {
    const foobar = resolve('.', 'foobar.js')
    const output = await escaladeAsync(fixtures, async () => foobar)
    expect(output).toBe(foobar)
  })

  it('should allow file input', async () => {
    let levels = 0
    const input = join(fixtures, 'index.js')
    const output = await escaladeAsync(input, async (dir) => {
      levels++
      return dir === fixtures && fixtures
    })
    expect(levels).toBe(1)
    expect(output).toBe(fixtures)
  })

  it('should receive directory names in contents list', async () => {
    let levels = 0
    const output = await escaladeAsync(fixtures, async (dir, files) => {
      levels++
      return files.includes('fixtures') && 'fixtures'
    })

    expect(levels).toBe(2)
    expect(output).toBe(fixtures)
  })

  it('should terminate walker immediately', async () => {
    let levels = 0
    const output = await escaladeAsync(fixtures, async () => `${++levels}.js`)

    expect(levels).toBe(1)
    expect(output).toBe(join(fixtures, '1.js'))
  })

  it('should traverse until root directory', async () => {
    let levels = 0

    const output = await escaladeAsync(fixtures, async () => {
      levels++
      return false
    })

    expect(output).toBe(undefined)
    expect(levels).toBe(fixtures.split(/[\\\/]+/g).length)
  })

  it('should end after `process.cwd()` read', async () => {
    let levels = 0
    const output = await escaladeAsync(fixtures, async (dir, files) => {
      levels++
      if (files.includes('package.json'))
        return join(dir, 'package.json')
    })

    expect(levels).toBe(3)
    expect(output).toBe(resolve('.', 'package.json'))
  })

  it('should handle deeper traversals', async () => {
    let levels = 0
    let contents = 0
    const input = join(fixtures, 'foo', 'bar', 'hello', 'world.txt')

    await escaladeAsync(input, async (dir, names) => {
      levels++
      contents += names.length
      if (dir === fixtures)
        return dir
    })

    expect(levels).toBe(4)
    expect(contents).toBe(10)
  })

  it('should support async callback', async () => {
    let levels = 0
    const sleep = () => new Promise(r => setTimeout(r, 10))
    const output = await escaladeAsync(fixtures, async (dir) => {
      await sleep().then(() => levels++)
      if (levels === 3)
        return dir
    })

    expect(levels).toBe(3)
    expect(output).toBe(resolve(fixtures, '..', '..'))
  })
})
