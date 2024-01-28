import type { JSValue } from 'untyped'
import { applyDefaults } from 'untyped'
import type { LoadConfigOptions } from 'c12'
import { loadConfig } from 'c12'
import type { TemplConfig, TemplOptions } from '@templ/schema'
import { TemplConfigSchema } from '@templ/schema'

export interface LoadTemplConfigOptions extends LoadConfigOptions<TemplConfig> {}

export async function loadTeamplConfig(opts: LoadTemplConfigOptions): Promise<TemplOptions> {
  (globalThis as any).defineTemplConfig = (c: any) => c
  const result = await loadConfig<TemplConfig>({
    rcFile: '.templrc',
    extend: { extendKey: ['extends'] },
    dotenv: true,
    globalRc: true,
    ...opts,
  })
  delete (globalThis as any).defineTemplConfig
  const { config } = result
  return await applyDefaults(TemplConfigSchema, config! as TemplConfig & Record<string, JSValue>) as unknown as TemplOptions
}
