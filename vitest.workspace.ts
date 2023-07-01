import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      include: ['packages/**/*.{test,spec}.{ts,js}'],
      exclude: ['**/node_modules/**/*'],
    },
  },
  {
    test: {
      name: '@grft/ui',
      environment: 'jsdom',
      include: ['packages/ui/**/*.{test,spec}.{ts,js}'],
      setupFiles: ['packages/ui/test/setup.ts'],
    },
  },
])
