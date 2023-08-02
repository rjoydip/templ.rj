/// <reference types='vitest' />

import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined',
  },
  test: {
    testTimeout: 100000,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
      reportsDirectory: resolve(__dirname, 'coverage'),
    },
    exclude: [
      '**/{.turbo,node_modules,coverage,dist}',
      'packages/**/{.turbo,.storybook,coverage,dist,src,node_modules,storybook-static,stories}',
      '**/*.{mdx,json,md,json,mjs}',
      '**/*.config.ts',
      '**/*.foo.ts',
    ],
  },
  plugins: [tsconfigPaths()],
})
