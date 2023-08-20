/// <reference types='vitest' />

import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined',
  },
  test: {
    testTimeout: 100000,
    include: ['test/**/*.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
    },
  },
  plugins: [tsconfigPaths()],
})
