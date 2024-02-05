import { join, resolve } from 'node:path'
import { cwd } from 'node:process'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { isCI } from 'std-env'
import { loadTeamplConfig } from '../src/load'

describe('@templ/config > load config', () => {
  let defaultData, fixturePath, fixture

  beforeAll(() => {
    defaultData = {
      APP_BASE_URL: '/',
      FRONTEND_BUILDER: 'vite',
      DATABASE_URL: './db.sqlite',
      HTTPS: false,
      NODE_ENV: 'production',
      OPEN_AI_API_KEY: '',
      PORT: 3000,
      URL: 'http://localhost:3000',
      LOG_LEVEL: 'silent',
      PACKAGE_BUILDER: 'esbuild',
      ROOT_DIR: resolve(cwd(), '..', '..'),
      WORKSPACE_DIR: resolve(cwd()),
    }

    fixturePath = resolve(cwd(), 'test', 'fixtures')
    fixture = (folder?: string | string[], file?: string) => file && folder ? resolve(fixturePath, Array.isArray(folder) ? join(...folder) : folder, file) : folder ? resolve(fixturePath, Array.isArray(folder) ? join(...folder) : folder) : resolve(fixturePath)
  })

  afterAll(() => {
    defaultData = null
    fixture = null
    fixturePath = null
  })

  it('should be load templrc file with directory', async () => {
    const data = await loadTeamplConfig({
      cwd: fixture('rc'),
      rcFile: '.templrc',
      globalRc: false,
    })
    expect(data).toStrictEqual({
      ...defaultData,
      LOG_LEVEL: 'info',
    })
  })

  it('should be load config from conf/templ enable rcFile', async () => {
    const data = await loadTeamplConfig({
      cwd: fixture(['conf', 'templ']),
      configFile: 'templ.config',
      rcFile: '.templrc',
      globalRc: false,
    })
    expect(data).toStrictEqual({
      ...defaultData,
      LOG_LEVEL: 'info',
      PORT: 5000,
    })
  })

  it('should be load config from conf/templ disable rcFile', async () => {
    const data = await loadTeamplConfig({
      cwd: fixture(['conf', 'templ']),
      configFile: 'templ.config',
      rcFile: false,
    })
    expect(data).toStrictEqual({
      ...defaultData,
      PORT: 5000,
    })
  })

  it('should be load config from conf directory', async () => {
    const data = await loadTeamplConfig({
      cwd: fixture('conf'),
      rcFile: false,
      globalRc: false,
    })
    expect(data).toStrictEqual({
      ...defaultData,
      APP_BASE_URL: '/config',
    })
  })

  it('should be load config from conf directory with dotenv', async () => {
    const data = await loadTeamplConfig({
      cwd: fixture('conf'),
      rcFile: false,
      globalRc: false,
      dotenv: !isCI,
    })
    expect(data).toStrictEqual({
      ...defaultData,
      APP_BASE_URL: '/config',
    })

    isCI && expect(process.env.OPEN_AI_API_KEY).toBeUndefined()
    !isCI && expect(process.env.OPEN_AI_API_KEY).toBe('openai api key')
  })

  it('should be load config from dev directory', async () => {
    const data = await loadTeamplConfig({
      cwd: fixture('dev'),
      rcFile: false,
      globalRc: false,
      dotenv: false,
    })
    expect(data).toStrictEqual({
      ...defaultData,
      configFile: true,
      overriden: false,
      APP_BASE_URL: '/dev',
      NODE_ENV: 'development',
    })
  })

  it('should be load config from dev directory with dotenv and interpolate', async () => {
    const data = await loadTeamplConfig({
      cwd: fixture('dev'),
      rcFile: false,
      globalRc: false,
      dotenv: {
        cwd: fixture('dev'),
        fileName: '.env.dev',
        interpolate: true,
      },
    })
    expect(data).toStrictEqual({
      ...defaultData,
      configFile: true,
      overriden: false,
      APP_BASE_URL: '/dev',
      NODE_ENV: 'development',
    })
    expect(process.env.URL).toBe('http://templ.local:1111')
  })
})
