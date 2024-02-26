import { cwd } from 'node:process'
import { loadConfig as lc } from 'c12'
import type { LoadConfigOptions } from 'c12'
import { env as stdEnv } from 'std-env'
import { configSchema, envSchema, flagSchema } from './schema'
import { createConf, createEnv, createFlag } from './core'

interface Options {}

/**
 * Retrieves the configuration options based on the provided parameters.
 *
 * @param {{ cwd: string, config?: Pick<T, 'cwd' | 'configFile' | 'envName' | 'defaultConfig' | 'overrides'> }} options - The options object containing cwd, config, env, and flag properties.
 * @return {Promise<Options>} A promise that resolves to the configuration options.
 */
export async function loadConfig<T extends LoadConfigOptions>(options: {
  cwd: string
  config?: boolean | Pick<T, 'cwd' | 'configFile' | 'envName' | 'defaultConfig' | 'overrides'>
  env?: boolean | Pick<T, 'cwd' | 'configFile' | 'envName' | 'defaultConfig' | 'overrides'>
  flag?: boolean | Pick<T, 'cwd' | 'configFile' | 'envName' | 'defaultConfig' | 'overrides'>
} = {
  cwd: cwd(),
  config: true,
  env: true,
  flag: true,
}): Promise<Options> {
  const data = {
    config: {},
    env: {},
    flag: {},
  }

  if (options.config) {
    const defaultConfOpions = {
      cwd: options.cwd,
      configFile: 'conf.ts',
      dotenv: false,
      envName: 'default',
      defaultConfig: {},
      overrides: {},
    }
    const restOpts = typeof options.config === 'boolean' ? defaultConfOpions : { ...defaultConfOpions, ...options.config }
    const { config } = await lc({ ...restOpts })
    const { server, client, shared } = configSchema
    data.config = createConf({
      client,
      server,
      shared,
      runtimeConf: config ?? {},
    })
  }

  if (options.env) {
    const restOpts = typeof options.env === 'boolean' ? { dotenv: true } : options.env
    await lc({ cwd: options.cwd, ...restOpts })
    const { server, client, shared } = envSchema
    data.env = createEnv({
      clientPrefix: 'PUBLIC_',
      client,
      emptyStringAsUndefined: true,
      runtimeEnv: stdEnv,
      server,
      shared,
    })
  }

  if (options.flag) {
    const restOpts = typeof options.flag === 'boolean' ? { configFile: 'flag.ts' } : options.flag
    const { config } = await lc({ cwd: options.cwd, ...restOpts })
    const { server, client, shared } = flagSchema
    data.flag = createFlag({
      clientPrefix: '',
      client,
      server,
      shared,
      runtimeFlag: config ?? {},
    })
  }

  return data
}
