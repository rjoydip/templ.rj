import { cwd } from 'node:process'
import { join, resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { isCI } from 'std-env'
import { loadConfig } from '../src'

describe.skip('@templ/config > load', () => {
  describe('should valid config object', () => {
    let defaultConfigData, fixturePath, fixture

    beforeAll(() => {
      defaultConfigData = {
        APP_BASE_URL: '/',
        DATABASE_URL: './db.sqlite',
        HTTPS: false,
        NODE_ENV: 'production',
        PORT: 3000,
        URL: 'http://localhost:3000',
        LOG_LEVEL: 'silent',
        APP_BUILDER: 'vite',
        PACKAGE_BUILDER: 'esbuild',
        ROOT_DIR: resolve(cwd(), '..', '..'),
        WORKSPACE_DIR: resolve(cwd()),
      }

      fixturePath = resolve(cwd(), 'test', 'fixtures')
      fixture = (folder?: string | string[], file?: string) => file && folder ? resolve(fixturePath, Array.isArray(folder) ? join(...folder) : folder, file) : folder ? resolve(fixturePath, Array.isArray(folder) ? join(...folder) : folder) : resolve(fixturePath)
    })

    afterAll(() => {
      defaultConfigData = null
      fixture = null
      fixturePath = null
    })

    it('should be load templrc file with directory', async () => {
      const data = await loadConfig({
        cwd: fixture('rc'),
        config: {
          rcFile: '.templrc',
          globalRc: false,
        },
      })
      expect(data).toStrictEqual({
        config: {
          ...defaultConfigData,
          LOG_LEVEL: 'info',
        },
        env: {},
        flag: {},
      })
    })

    it('should be load config from conf/templ enable rcFile', async () => {
      const data = await loadConfig({
        cwd: fixture(['conf', 'templ']),
        config: {
          configFile: 'templ.config',
          rcFile: '.templrc',
          globalRc: false,
        },
      })
      expect(data).toStrictEqual({
        config: {
          ...defaultConfigData,
          LOG_LEVEL: 'info',
          PORT: 5000,
        },
        env: {},
        flag: {},
      })
    })

    it('should be load config from conf/templ disable rcFile', async () => {
      const data = await loadConfig({
        cwd: fixture(['conf', 'templ']),
        config: {
          configFile: 'templ.config',
          rcFile: false,
        },
      })
      expect(data).toStrictEqual({
        config: {
          ...defaultConfigData,
          PORT: 5000,
        },
        env: {},
        flag: {},
      })
    })

    it('should be load config from conf directory', async () => {
      const data = await loadConfig({
        cwd: fixture('conf'),
        config: {
          rcFile: false,
          globalRc: false,
        },
      })
      expect(data).toStrictEqual({
        config: {
          ...defaultConfigData,
          APP_BASE_URL: '/config',
        },
        env: {},
        flag: {},
      })
    })

    it('should be load config from conf directory with dotenv', async () => {
      const data = await loadConfig({
        cwd: fixture('conf'),
        config: {
          rcFile: false,
          globalRc: false,
          dotenv: !isCI,
        },
      })
      expect(data).toStrictEqual({
        config: {
          ...defaultConfigData,
          APP_BASE_URL: '/config',
        },
        env: {},
        flag: {},
      })

      isCI && expect(process.env.OPEN_AI_API_KEY).toBeUndefined()
      !isCI && expect(process.env.OPEN_AI_API_KEY).toBe('openai api key')
    })

    it('should be load config from dev directory', async () => {
      const data = await loadConfig({
        cwd: fixture('dev'),
        config: {
          rcFile: false,
          globalRc: false,
          dotenv: false,
        },
      })
      expect(data).toStrictEqual({
        config: {
          ...defaultConfigData,
          configFile: true,
          overriden: false,
          APP_BASE_URL: '/dev',
          NODE_ENV: 'development',
        },
        env: {},
        flag: {},
      })
    })

    it('should be load config from dev directory with dotenv and interpolate', async () => {
      const data = await loadConfig({
        cwd: fixture('dev'),
        config: {
          rcFile: false,
          globalRc: false,
          dotenv: {
            cwd: fixture('dev'),
            fileName: '.env.dev',
            interpolate: true,
          },
        },
      })
      expect(data).toStrictEqual({
        config: {
          ...defaultConfigData,
          configFile: true,
          overriden: false,
          APP_BASE_URL: '/dev',
          NODE_ENV: 'development',
        },
        env: {},
        flag: {},
      })
      expect(process.env.URL).toBe('http://templ.local:1111')
    })
  })
})
