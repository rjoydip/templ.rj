/// <reference types='vitest' />

import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    testTimeout: 10000,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
      reportsDirectory: resolve(__dirname, 'coverage'),
    },
  },
  plugins: [tsconfigPaths()],
})
