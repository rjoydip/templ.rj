import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { beforeAll, describe, expect, it } from 'vitest'
import { loadTeamplConfig } from '../src/load'

describe('@templ/config > load config', () => {
  let defaultData, fixturePath, fixture

  beforeAll(() => {
    defaultData = {
      app: {
        baseURL: '/',
      },
      builder: 'vite',
      devServer: {
        host: 'localhost',
        https: false,
        port: 3000,
        url: 'http://localhost:3000',
      },
      logLevel: 'silent',
      rootDir: resolve(cwd(), '..', '..'),
      workspaceDir: resolve(cwd()),
    }

    fixturePath = resolve(__dirname, 'fixtures')
    fixture = (folder?: string, file?: string) => file && folder ? resolve(fixturePath, folder, file) : folder ? resolve(fixturePath, folder) : resolve(fixturePath)
  })

  it('should be load .templrc', async () => {
    const data = await loadTeamplConfig({
      rcFile: fixture(fixturePath, '.templrc'),
    })
    expect(data).toBeDefined()
    expect(data).toStrictEqual({
      ...defaultData,
      logLevel: 'info',
    })
  })

  it('should be load templrc file', async () => {
    const data = await loadTeamplConfig({
      cwd: fixturePath,
      rcFile: '.templrc',
    })
    expect(data).toBeDefined()
    expect(data).toStrictEqual({
      ...defaultData,
      logLevel: 'info',
    })
  })

  it('should be load configFile templ.config.ts', async () => {
    const data = await loadTeamplConfig({
      configFile: fixture(fixturePath, 'templ.config'),
    })
    expect(data).toBeDefined()
    expect(data).toStrictEqual({
      ...defaultData,
      builder: 'esbuild',
    })
  })

  it('should be load configFile templ.config disabling rcFile', async () => {
    const data = await loadTeamplConfig({
      cwd: fixturePath,
      configFile: 'templ.config',
      rcFile: false,
    })
    expect(data).toBeDefined()
    expect(data).toStrictEqual({
      ...defaultData,
      builder: 'esbuild',
    })
  })

  it('should be load theme/config.ts', async () => {
    const data = await loadTeamplConfig({
      cwd: fixture('theme'),
    })
    expect(data).toBeDefined()
    expect(data).toStrictEqual({
      ...defaultData,
      app: {
        baseURL: '/theme',
      },
    })
  })
})
