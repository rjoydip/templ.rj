import { defineProject, mergeConfig } from 'vitest/config'
import { getVitestConfig } from './src'

export default mergeConfig(
  getVitestConfig(),
  defineProject({}),
)
