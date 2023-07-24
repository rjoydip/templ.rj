import { defineConfig } from 'tsup'
import { mergeConfig } from 'vitest/config'
import { config as defaultTsupSharedConfig } from '../../tsup.shared'

export default defineConfig((options) => {
  return mergeConfig(defaultTsupSharedConfig, {
    splitting: true,
    minify: !options.watch,
  })
})
