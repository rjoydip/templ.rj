import { defineProject, mergeConfig } from 'vitest/config'
import configShared from '../../../config/vitest/shared.ts'

export default mergeConfig(
  configShared,
  defineProject({}),
)
