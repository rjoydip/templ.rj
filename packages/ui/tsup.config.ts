import { defineConfig } from 'tsup'
import { mergeConfig } from 'vitest/config'
import { config as defaultTsupSharedConfig } from '../../tsup.shared'

export default defineConfig((options) => {
  return mergeConfig(defaultTsupSharedConfig, {
    minify: !options.watch,
  })
})
