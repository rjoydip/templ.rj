import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**/*.js'],
    coverage: {
      enabled: true,
      reporter: ['text', 'json', 'html'],
    },
  },
})
