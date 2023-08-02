import { preact } from '@preact/preset-vite'
import { defineWorkspace } from 'vitest/config'

// defineWorkspace provides a nice type hinting DX
export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'happy-dom',
      environment: 'happy-dom',
      include: ['packages/ui/**'],
    },
    plugins: [preact()],
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'node',
      environment: 'node',
      include: [
        'packages/cli/**',
        'packages/core/**',
        'packages/config/**',
        'packages/utils/**',
      ],
    },
  },
])
