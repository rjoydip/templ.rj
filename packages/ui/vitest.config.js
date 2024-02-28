import { resolve } from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'
import { getVitestConfig } from '@templ/config'

export default mergeConfig(
  getVitestConfig(),
  defineConfig({
    test: {
      alias: {
        '@': resolve('./'),
      },
      environment: 'happy-dom',
      include: ['registry/**/*.test.{jsx,tsx}'],
      setupFiles: ['./setupTests.ts'],
      threads: false,
    },
  }),
)
