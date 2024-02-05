import { defineProject, mergeConfig } from 'vitest/config'
import configShared from '../../config/vitest.shared.js'

export default mergeConfig(
  configShared,
  defineProject({}),
)
