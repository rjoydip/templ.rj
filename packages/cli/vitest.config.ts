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
  },
  plugins: [tsconfigPaths()],
})
