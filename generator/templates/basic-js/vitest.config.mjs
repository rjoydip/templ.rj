import { defineProject, mergeConfig } from 'vitest/config'
import configShared from '../../../config/vitest/share.js'

export default mergeConfig(
  configShared,
  defineProject({}),
)
