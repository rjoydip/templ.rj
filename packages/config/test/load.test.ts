import { cwd } from 'node:process'
import { resolve } from 'node:path'
import { findWorkspaceDir } from 'pkg-types'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { z } from 'zod'
import { isCI } from 'std-env'
import { loadConfig } from '../src'

describe('@templ/config > load', async () => {
  const root = await findWorkspaceDir(cwd())
  const fixturePath = resolve(root, 'fixtures', '.config')
  describe('load config', () => {
    let defaultConfigData

    beforeAll(async () => {
      defaultConfigData = {
        BASE_URL: '/',
        BUILDER: 'vite',
        DIR: root,
        LOG_LEVEL: 'silent',
        PUBLIC_URL: 'http://127.0.0.1:3000',
        WORKSPACE_DIR: cwd(),
      }
    })

    afterAll(() => {
      defaultConfigData = null
    })

    it('should be loaded config from fixture/.config/conf.ts file', async () => {
      const data = await loadConfig({
        cwd: fixturePath,
        config: true,
      })
      expect(data).toStrictEqual({
        config: {
          ...defaultConfigData,
          PUBLIC_URL: 'http://127.0.0.1:3000/test',
        },
        env: {},
        flag: {},
      })
    })

    it('should be loaded config from .config/templ.config.ts', async () => {
      const data = await loadConfig({
        cwd: fixturePath,
        config: {
          configFile: 'templ.config',
        },
      })
      expect(data).toStrictEqual({
        config: {
          ...defaultConfigData,
          PUBLIC_URL: 'http://127.0.0.1:3000/test',
        },
        env: {},
        flag: {},
      })
    })

    it('should be loaded config from .config/config.ts with envName test', async () => {
      const data = await loadConfig({
        cwd: fixturePath,
        config: {
          envName: 'test',
        },
      })

      expect(data).toStrictEqual({
        config: {
          ...defaultConfigData,
          PUBLIC_URL: 'http://127.0.0.1:3000/test',
        },
        env: {},
        flag: {},
      })
    })

    it('should be loaded config from .config/config.ts using with defaultConfig', async () => {
      const data = await loadConfig({
        cwd: fixturePath,
        config: {
          defaultConfig: defaultConfigData,
        },
      })
      expect(data).toStrictEqual({
        config: {
          ...defaultConfigData,
          PUBLIC_URL: 'http://127.0.0.1:3000/test',
        },
        env: {},
        flag: {},
      })
    })

    it('should be loaded config from conf directory with dotenv', async () => {
      const data = await loadConfig({
        cwd: fixturePath,
        config: {
          overrides: {
            LOG_LEVEL: 'info',
          },
        },
      })
      expect(data).toStrictEqual({
        config: {
          ...defaultConfigData,
          PUBLIC_URL: 'http://127.0.0.1:3000/test',
          LOG_LEVEL: 'info',
        },
        env: {},
        flag: {},
      })
    })

    it('should should not throw error when wrong config key-value passed as overwrides', async () => {
      const data = await loadConfig({
        cwd: fixturePath,
        config: {
          overrides: {
            WRONG_Key: 'WRONG_VALUE',
          },
        },
      })
      expect(data).toStrictEqual({
        config: {
          ...defaultConfigData,
          PUBLIC_URL: 'http://127.0.0.1:3000/test',
        },
        env: {},
        flag: {},
      })
    })
    it('should should not throw error when wrong config key-value passed', async () => {
      try {
        await loadConfig({
          cwd: fixturePath,
          config: {
            configFile: 'wrong.config',
          },
        })
      }
      catch (err) {
        if (err instanceof z.ZodError)
          expect(err.issues).toBe('❌ Invalid config variables: { PUBLIC_URL: [ \'Required\' ] }')
      }
    })
  })

  describe('load env', () => {
    let defaultEnvData

    beforeAll(async () => {
      defaultEnvData = {
        DATABASE_URL: 'postgres//127.0.0.1:5432/mydb',
        OPEN_AI_API_KEY: 'OPEN_AI_API_KEY',
      }
    })

    afterAll(() => {
      defaultEnvData = null
    })

    it('should load environment values from .env file', async () => {
      const data = await loadConfig({
        cwd: fixturePath,
        env: true,
      })
      expect(data).toStrictEqual({
        config: {},
        env: {
          ...defaultEnvData,
        },
        flag: {},
      })

      if (isCI) {
        expect(process.env.DATABASE_URL).toBe('')
        expect(process.env.OPEN_AI_API_KEY).toBe('')
      }
      else {
        expect(process.env.DATABASE_URL).toBe('postgres//127.0.0.1:5432/mydb')
        expect(process.env.OPEN_AI_API_KEY).toBe('OPEN_AI_API_KEY')
      }
    })

    it('should load environment values from .env.local file', async () => {
      const data = await loadConfig({
        cwd: fixturePath,
        env: {
          configFile: 'env.local',
        },
      })
      expect(data).toStrictEqual({
        config: {},
        env: {
          ...defaultEnvData,
        },
        flag: {},
      })

      if (isCI) {
        expect(process.env.DATABASE_URL).toBe('')
        expect(process.env.OPEN_AI_API_KEY).toBe('')
      }
      else {
        expect(process.env.DATABASE_URL).toBe('postgres//127.0.0.1:5432/mydb')
        expect(process.env.OPEN_AI_API_KEY).toBe('OPEN_AI_API_KEY')
      }
    })

    it('should throw error when wrong value is being provided instead of right', async () => {
      try {
        await loadConfig({
          cwd: fixturePath,
          env: {
            overrides: {
              ...defaultEnvData,
              OPEN_AI_API_KEY: true,
            },
          },
        })
      }
      catch (err) {
        if (err instanceof z.ZodError)
          expect(err.issues).toBe('❌ Invalid environment variables: { HEADER: [ \'Expected string, received boolean\' ] }')
      }
    })
  })

  describe('load flag', () => {
    let defaultFlagData

    beforeAll(async () => {
      defaultFlagData = {
        HTTPS: true,
      }
    })

    afterAll(() => {
      defaultFlagData = null
    })

    it('should load flags from flag file', async () => {
      const data = await loadConfig({
        cwd: fixturePath,
        flag: true,
      })
      expect(data).toStrictEqual({
        config: {},
        env: {},
        flag: {
          ...defaultFlagData,
          HEADER: false,
        },
      })
    })

    it('should load flags from flag file when undefined value', async () => {
      const data = await loadConfig({
        cwd: fixturePath,
        flag: {
          overrides: {
            ...defaultFlagData,
            HEADER: undefined,
          },
        },
      })
      expect(data).toStrictEqual({
        config: {},
        env: {},
        flag: {
          ...defaultFlagData,
          HEADER: false,
        },
      })
    })

    it('should throw error when string is being provided instead of boolean', async () => {
      try {
        await loadConfig({
          cwd: fixturePath,
          flag: {
            overrides: {
              ...defaultFlagData,
              HEADER: 'undefined',
            },
          },
        })
      }
      catch (err) {
        if (err instanceof z.ZodError)
          expect(err.issues).toBe('❌ Invalid feature flag variables: { HEADER: [ \'Expected boolean, received string\' ] }')
      }
    })
  })
})
