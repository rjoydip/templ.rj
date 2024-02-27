import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      // TODO: remove UI from exclude list when UI tests are added
      exclude: ['**/.config/**', '**/.next/**', '**/.storybook/**', '**/coverage/**', '**/dist/**', '**/ui/**', '**/fixtures/**', '**/scripts/**', '**/*.stories.{jsx,tsx}', '**/*.config.{js,ts}'],
    },
  },
})
