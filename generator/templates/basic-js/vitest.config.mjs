import { defineProject, mergeConfig } from 'vitest/config'
import configShared from '../../../.config/vitest.shared'

export default mergeConfig(
  configShared,
  defineProject({}),
)
