import { defineProject, mergeConfig } from 'vitest/config'
import configShared from '../../../config/vitest/share.ts'

export default mergeConfig(
  configShared,
  defineProject({}),
)
