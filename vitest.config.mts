import { defineConfig } from 'vitest/config'

const exclude = ['**/{.config,.next,.storybook,artifacts,coverage,dist,fixtures,generator,node_modules,scripts,templates}/**', '**/apps/web', '**/ui/{components,registry}', '**/*.{spec,config}.?(c|m)[jt]s?(x)', '**/*.d.ts', '**/index.?(c|m)[jt]s?(x)', '**/templ.mjs']
const include = ['**/*.test.?(c|m)[jt]s?(x)']

export default defineConfig({
  test: {
    include,
    coverage: {
      enabled: true,
      exclude,
    },
  },
})
