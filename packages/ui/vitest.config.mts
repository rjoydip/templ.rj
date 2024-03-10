import { defineConfig, mergeConfig } from 'vitest/config'
import { getVitestConfig } from '@templ/config'

const exclude = ['{components,registry}/**', '*.config.{js,ts}', '*.d.ts']

export default mergeConfig(
  getVitestConfig(),
  defineConfig({
    test: {
      exclude,
      coverage: {
        exclude,
      },
    },
  }),
)
