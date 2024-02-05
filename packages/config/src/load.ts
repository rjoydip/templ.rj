import type { JSValue } from 'untyped'
import { applyDefaults } from 'untyped'
import type { LoadConfigOptions } from 'c12'
import { loadConfig } from 'c12'
import type { TemplConfig, TemplOptions } from './types'
import { TemplConfigSchema } from './schema'

interface LoadTemplConfigOptions extends LoadConfigOptions<TemplConfig> {}

export async function loadTeamplConfig(opts: LoadTemplConfigOptions): Promise<TemplOptions> {
  (globalThis as any).defineTemplConfig = (c: any) => c
  const { config } = await loadConfig<TemplConfig>({
    ...opts,
  })

  delete (globalThis as any).defineTemplConfig
  return await applyDefaults(TemplConfigSchema, config! as TemplConfig & Record<string, JSValue>) as unknown as TemplOptions
}
