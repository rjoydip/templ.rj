import { defineProject, mergeConfig } from 'vitest/config'
import configShared from '../../vite.shared'

export default mergeConfig(
  configShared,
  defineProject({
    test: {},
  }),
)
